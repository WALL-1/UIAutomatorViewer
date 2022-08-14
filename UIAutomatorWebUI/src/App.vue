<template>
  <div class="app">
    <resizable-view @itemresize="onPhoneBoxResize">
      <resizable-item :min-width="360" base-width="40%" ref="basePhoneBox">
        <!-- 设备操作栏 -->
        <simple-header title="设备">
          <el-select
            v-model="serial"
            placeholder="选择设备"
            clearable
            filterable
            size="mini"
            style="max-width: 150px; padding: 2px 20px 0 0"
          >
            <el-option
              v-for="(item, key) in deviceList"
              :key="key"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-button type="primary" size="mini" @click="onRefreshButtonClick"
            >连接/刷新</el-button
          >
        </simple-header>
        <!-- 手机视图 -->
        <resizable-view
          class="phone-box"
          mode="none"
          @itemresize="onPhoneResize"
        >
          <resizable-item
            :base-width="320"
            :base-height="480"
            :min-width="320"
            :min-height="480"
            slider-bar="all"
            slider-area="right-bottom"
            ref="phoneBox"
          >
            <phone-view
              ref="phoneView"
              @elementclick="onTreeNodeClick"
              @elementdoubleclick="onPhoneElementDoubleClick"
              @keypressed="onPhoneKeyPressed"
            ></phone-view>
          </resizable-item>
        </resizable-view>
      </resizable-item>
      <!-- 属性表 -->
      <resizable-item base-width="30%" :min-width="360">
        <simple-header title="属性"></simple-header>
        <el-table
          :data="Object.keys(currentNode)"
          border
          height="calc(100% - 50px)"
        >
          <el-table-column label="key" width="150">
            <template slot-scope="scope">
              <strong>{{ scope.row.replace("@", "") }}</strong>
            </template>
          </el-table-column>
          <el-table-column label="value" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ currentNode[scope.row] }}
            </template>
          </el-table-column>
        </el-table>
      </resizable-item>
      <!-- 节点树 -->
      <resizable-item base-width="30%" :min-width="100">
        <simple-header title="结构"></simple-header>
        <div style="height: calc(100% - 50px); overflow: auto">
          <el-tree
            :data="data"
            :props="defaultProps"
            :default-expanded-keys="defaultExpandedKeys"
            @node-click="onTreeNodeClick"
          ></el-tree>
        </div>
      </resizable-item>
    </resizable-view>
  </div>
</template>

<script>
import SimpleHeader from "./components/SimpleHeader.vue";
import PhoneView from "./components/PhoneView";
export default {
  components: { PhoneView, SimpleHeader },
  data() {
    return {
      serial: undefined,
      deviceList: [],
      data: [],
      defaultProps: {
        children: "nodes",
        label: "class",
      },
      defaultExpandedKeys: [0, 1],
      currentNode: {},
    };
  },
  methods: {
    onRefreshButtonClick() {
      let self = this;
      self.$api.devices().then((res) => {
        self.deviceList = res;

        let isOldDevice = false;
        /**
         * 1. 如果已经选择过设备编码，但设备编码不在新的设备列表里面，那么清空已选择的设备编码，尝试获取设备列表的第一个设备作为初始化设备
         * 2. 否则标记为旧设备，直接执行刷新页面
         *
         *  */
        if (typeof self.serial === "string") {
          if (self.deviceList.includes(self.serial)) isOldDevice = true;
          else self.serial = undefined;
        }
        // 没有选择设备编码时，尝试获取设备列表的第一个设备作为初始化设备
        if (self.serial === undefined && self.deviceList.length > 0)
          self.serial = self.deviceList[0];
        // 实在拿不到设备编码提示并返回
        if (self.serial === undefined) {
          self.$message.warning("Device list is null.");
          return;
        }

        /**
         * 新设备连接服务器并刷新视图，旧设备直接刷新视图
         *
         */
        // 老设备直接刷新视图
        if (isOldDevice) {
          self.$api.dump(self.serial).then((res) => {
            self.setPhoneView(
              undefined,
              undefined,
              res.width,
              res.height,
              res.imageURL,
              res.xml
            );
          });
        }
        // 连接新设备并刷新视图
        else {
          self.$api.connect(self.serial).then(() => {
            self.$api.dump(self.serial).then((res) => {
              self.setPhoneView(
                undefined,
                undefined,
                res.width,
                res.height,
                res.imageURL,
                res.xml
              );
            });
          });
        }
      });
    },
    setPhoneView(width, height, realWidth, realHeight, imageURL, xml) {
      let self = this;
      self.$refs.phoneView.width =
        width === undefined ? self.$refs.phoneView.width : width;
      self.$refs.phoneView.height =
        height === undefined ? self.$refs.phoneView.height : height;
      self.$refs.phoneView.realWidth =
        realWidth === undefined ? self.$refs.phoneView.realWidth : realWidth;
      self.$refs.phoneView.realHeight =
        realHeight === undefined ? self.$refs.phoneView.realHeight : realHeight;
      self.$refs.phoneView.imageURL =
        imageURL === undefined
          ? self.$refs.phoneView.imageURL
          : imageURL + `?t=${Math.random()}`;
      self.$refs.phoneView.xml =
        xml === undefined ? self.$refs.phoneView.xml : xml;
      // 获取属性表、结构树相关数据
      let hierarchy = self.$refs.phoneView.hierarchy;
      self.data = [hierarchy.nodes];
    },
    onPhoneResize(width, height) {
      this.setPhoneView(
        width,
        height,
        undefined,
        undefined,
        undefined,
        undefined
      );
    },
    onPhoneBoxResize(width) {
      if (this.$refs.phoneView.width > width) {
        this.$refs.phoneBox.width = width;
        this.setPhoneView(
          width,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
      }
    },
    onPhoneElementDoubleClick(node) {
      let self = this;
      self.$api
        .call(self.serial, "click",undefined,[node.centerX,node.centerY])
        .then(() => {
          self.$api.dump(self.serial).then((res) => {
            self.setPhoneView(
              undefined,
              undefined,
              res.width,
              res.height,
              res.imageURL,
              res.xml
            );
          });
        });
    },
    onPhoneKeyPressed(key){
      let self = this;
      self.$api
        .call(self.serial, "press",undefined,[key])
        .then(() => {
          self.$api.dump(self.serial).then((res) => {
            self.setPhoneView(
              undefined,
              undefined,
              res.width,
              res.height,
              res.imageURL,
              res.xml
            );
          });
        });
    },
    onTreeNodeClick(node) {
      node = Object.assign({},node)
      delete node["nodes"];
      delete node["centerX"];
      delete node["centerY"];
      delete node["level"];
      delete node["showX"];
      delete node["showY"];
      delete node["showWidth"];
      delete node["showHeight"];
      delete node["uuid"];
      this.currentNode = node;

    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
.app {
  width: 100%;
  height: 100vh;
}

.phone-box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  flex-grow: 0;
  height: calc(100% - 50px) !important;
}

.phone-box .rv-slider-bar {
  background: #fff;
}

.tree {
  overflow: auto;
  width: 100px;
}
.el-tree {
  min-width: 100%;
  display: inline-block !important;
}
</style>