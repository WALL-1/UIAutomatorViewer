function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (Math.random() * 16) | 0
        let v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

function getNodeRect(node) {
    let bounds = node.bounds !== undefined ? node.bounds : '[0,0][0,0]'
    let rect = bounds.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/).slice(1).map(v => parseFloat(v))

    let result = {
        x: rect[0],
        y: rect[1],
        width: rect[2] - rect[0],
        height: rect[3] - rect[1],
        centerX: (rect[2] - rect[0]) / 2 + rect[0],
        centerY: (rect[3] - rect[1]) / 2 + rect[1],
        level: 100000000-((rect[2] - rect[0]) * (rect[3] - rect[1]))
    }

    return result
}

function transformNodeRect(node, deviceWidth, deviceHeight, viewportWidth, viewportHeight) {
    let widthScale = viewportWidth / deviceWidth
    let heightScale = viewportHeight / deviceHeight
    let result = {
        showX: parseInt(node.x * widthScale),
        showY: parseInt(node.y * heightScale),
        showWidth: parseInt(node.width * widthScale),
        showHeight: parseInt(node.height * heightScale)
    }
    return result
}

function getNodeObjects(el) {

    let result = { class: el.localName, uuid: uuid() }
    for (let i = 0; i < el.attributes.length; i++) {
        let attr = el.attributes[i]
        result[attr.name] = attr.value
    }
    result = Object.assign(result, getNodeRect(result))

    let nodes = []
    for (let i = 0; i < el.children.length; i++) 
        nodes.push(getNodeObjects(el.children[i]))

    result.nodes = nodes

    return result
}

function getShowNodeObjects(node, deviceWidth, deviceHeight, viewportWidth, viewportHeight) {
    let rect = transformNodeRect(node, deviceWidth, deviceHeight, viewportWidth, viewportHeight)
    node = Object.assign(node, rect)

    node.nodes = node.nodes.map(v => {
        return getShowNodeObjects(v,deviceWidth,deviceHeight,viewportWidth,viewportHeight)
    })

    return node
}

function getShowDict(node) {
    let dict = new Object()
    
    node.nodes.forEach(v => {
        dict = Object.assign(dict,getShowDict(v))
    })  
    
    let self = Object.assign({},node)
    delete self['nodes']
    dict[node.uuid] = self
    return dict
}

function getShowElements(node,format) {
    let elements = []
    let element = `<div class="show-element" uuid="${node.uuid}" style="top:${node.showY}px;left:${node.showX}px;width:${node.showWidth}px;height:${node.showHeight}px;z-index:${node.level};"></div>`
    if(typeof format ==='function')
        element = format(node)
    elements.push(element)
    
    node.nodes.forEach(v => {
        elements = elements.concat(getShowElements(v,format))
    })  

    return elements
}

function transform(xml,deviceWidth, deviceHeight, viewportWidth, viewportHeight,format){
    let el = document.createElement('window')
    el.innerHTML = xml
    
    let nodes = getNodeObjects(el)
    let showNodes = getShowNodeObjects(nodes,deviceWidth,deviceHeight,viewportWidth,viewportHeight)
    let showElements = getShowElements(showNodes,format)
    let showDict = getShowDict(showNodes)
    return {'nodes':nodes,'showDict':showDict,'showElements':showElements.join('\n')}
}
export default{
    transform
}
