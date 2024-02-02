# scp -r ./dist/* springboot:/home/yy/music/
# 清空springboot:/home/yy/music/目录下的文件再上传
ssh springboot "rm -rf /home/yy/music/*"
scp -r ./dist/* springboot:/home/yy/music/