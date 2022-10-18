### 基本使用
1. 先打开doraemon代理页面， 下面三个域名之一
+ [http://172.16.100.225:7001/page/proxy-server](http://172.16.100.225:7001/page/proxy-server)
+ [http://doraemon.dtstack.com:7001/page/proxy-server](http://doraemon.dtstack.com:7001/page/proxy-server)
+ [http://doraemon.dtstack.com/page/proxy-server](http://doraemon.dtstack.com/page/proxy-server)
1. 将需要添加到扩展的代理服务展开，如下图
   ![image-20221013175452208](/image-doc1.png)

2. 打开doraemon扩展程序，并点击抓取按钮，如下图
   ![image-20221013175702058](/image-doc2.png)

3. 已成功抓取到离线服务下的所有规则，其他需要添加的项目重复2，3步骤即可。

### 常见问题
1. 抓取时提示`请先打开doraemon代理页` 

   插件只会向**步骤1**所列的三个网址进行脚本注入，检查当前网址是否在其中

2. 抓取时提示`内容脚本未注入`

   可能时由于安装扩展时已打开了doraemon页面，导致内容脚本没有成功注入，刷新页面即可

3. 扩展中的代理规则跟实际的代理规则不匹配

   通过doraemon代理页直接切换代理启用状态，导致插件这边未同步，点击刷新图标后会直接从接口拿取最新数据
   ![image-20221014173417046](/image-doc3.png)

4. 我想删除某个服务，该怎么办？
   
   右键扩展图标，点击选项，进入Options页后可以对服务进行删除
