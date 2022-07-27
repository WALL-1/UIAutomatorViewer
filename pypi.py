import os
import shutil
import subprocess


encoding = 'utf8'

for dir in os.listdir():
    if dir in ['build','dist']\
        or dir.endswith('.egg-info'):
        shutil.rmtree(dir)
        print('Removing',os.path.abspath(dir))

try:
    import twine
    print("Installing twine")
except ImportError:
    res = subprocess.check_output('pip install twine',shell=True,encoding=encoding)
    print(res)

res = subprocess.check_output('python setup.py sdist',encoding=encoding)
print(res)
res = subprocess.check_output('python setup.py install',encoding=encoding)
print(res)
res = subprocess.run('python -m twine upload dist/*',shell=True,encoding=encoding)
print(res)