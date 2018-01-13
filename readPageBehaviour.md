# 微信小程序
## 微信小程序电商源码：外卖小程序，电商小程序，门店类小程序，展示类小程序，批发商城小程序。

#### 项目介绍

	1.此项目是一套完整的电商系统，并且兼容各种电商场景可以很好的运用在各个领域。
	2.包含页面数43页，组件数14
	3.开源前端代码供大家学习，并且有许多漂亮的页面模板。
	
#### 页面架构与说明

    进入页 : pages/index/index
    首页 : custom_page_index
    新闻页 : news_list  news_detail
    版权说明 : custom_page_copyright
    我的 : custom_page_userinfo
    列表页 : search_product
    三级列表 : search_product2
    列表页2 : product_tree_list
    列表页3 : product_waimai 
    列表页4 : product_waimai_offline
    二级列表 : product_type2
    订单列表 : order_list
    订单详细 : order_detail
    编辑订单 : edit_order
    提交订单完成与付款页面 : submit_order_result
    退货列表 : back_item_list
    退货详情 : back_item_detail
    评价订单 : order_shop_comment    
    大师推荐 : brand_list
    大师推荐详细 : brand_detail
    购物车 : shopping_car_list
    登录 : login
    注册 : regist
    用户协议 : regist_xieyi
    优惠券 : my_coupons
    获取优惠券 : available_coupons 
    收藏与喜欢 : my_favorite
    积分 	user_jifen_events
    个人资料 : pre_change_user_info
    我的消息 : message_counter2
    地址 : address
    添加新地址 : add_address
    我的足迹 : user_visit_items
    余额充值列表 : user_account_events
    余额充值页面 : user_recharge
    商品管理 : shop_manager_products

## 页面详情说明

#### 进入页 : pages/index/index

    页面功能：页面主要处理进入动画或者加载前操作，
    使用方式：放在app.json中pages的第一项
    页面主要处理函数：onload --> 判定扫码状态并且指定当前的项目名称
    使用接口： 无（暂时 - 可以自定义）

####  首页 : custom_page_index

    页面功能：首页展示，
    页面主要处理函数: getParac --> 获取此页面后台配置信息
                     getPartials --> 强转json
                     tolinkUrl --> 页面跳转方式
    使用接口： custom_page_:id
    参数说明： jsonOnly=1（表示返回的数据格式为json）
    返回的json说明: "{beanRemark:'自定义页面表',channelName:'页面名称(只允许英文数字结合)',channelTitle:'页面标题channelDescription:'页面描述',channelKeywords:'页面关键词',channelTemplate:'页面使用模板',pageType:'页面类型(弃用)',index:'是否主页 (弃用  0 否 1 是)',belongShopId:'归属店铺ID(0 平台页面  )',platformNo:'平台号',belongShopName:'归属店铺名',functionType:'页面是单独页面还是页面的某个模块  0页面 1模块',terminalType:'终端类型(弃用)',partials:'装饰  参考 List<ProductChannelPartial>' }"


#### 新闻列表页 : news_list  

    页面功能 : 新闻页 - 或者推广页
    页面主要处理函数: getNewsData --> 获取新闻列表内容
                     getCusPage --> 获取此页面后台配置信息
                     getPartials --> 强转json
    使用接口： Client.Get.NewsBbsList - more_news_bbs_list
    参数说明： page( 列表页专用 -- 表示将要获取的页面  1代表第一页 2代表第二页 )
              newsTypeId ( 新闻类型ID,后台可以查看 )
    返回的json说明: 


#### 新闻详情页 : news_detail

    页面功能 : 新闻详情页 
    页面主要处理函数: getNewsData --> 获取新闻列表内容
                     getCusPage --> 获取此页面后台配置信息
                     getPartials --> 强转json
    使用接口： Client.Bbs.NewsDetail - get_news_bbs_detail
    参数说明： newsId( 新闻ID )
    返回的json说明: 

#### 版权说明 : custom_page_copyright

    页面功能 : 版权说明页 
    页面主要处理函数: getCustomPage --> 获取此页面后台配置信息
    使用接口： custom_page_:id
    参数说明： jsonOnly=1（表示返回的数据格式为json）
    返回的json说明: "{beanRemark:'自定义页面表',channelName:'页面名称(只允许英文数字结合)',channelTitle:'页面标题channelDescription:'页面描述',channelKeywords:'页面关键词',channelTemplate:'页面使用模板',pageType:'页面类型(弃用)',index:'是否主页 (弃用  0 否 1 是)',belongShopId:'归属店铺ID(0 平台页面  )',platformNo:'平台号',belongShopName:'归属店铺名',functionType:'页面是单独页面还是页面的某个模块  0页面 1模块',terminalType:'终端类型(弃用)',partials:'装饰  参考 List<ProductChannelPartial>' }"


#### 我的 : custom_page_userinfo

    页面功能 : 我的 
    页面主要处理函数: getData --> 获取此页面后台配置信息
    使用接口： custom_page_:id
    参数说明： jsonOnly=1（表示返回的数据格式为json）
    返回的json说明: "{beanRemark:'自定义页面表',channelName:'页面名称(只允许英文数字结合)',channelTitle:'页面标题channelDescription:'页面描述',channelKeywords:'页面关键词',channelTemplate:'页面使用模板',pageType:'页面类型(弃用)',index:'是否主页 (弃用  0 否 1 是)',belongShopId:'归属店铺ID(0 平台页面  )',platformNo:'平台号',belongShopName:'归属店铺名',functionType:'页面是单独页面还是页面的某个模块  0页面 1模块',terminalType:'终端类型(弃用)',partials:'装饰  参考 List<ProductChannelPartial>' }"


#### 列表页 : search_product

    页面功能 : 商品列表页面 （含商品查询）
    页面主要处理函数: getData --> 获取商品列表信息

    使用接口：Client.Get.ProductListMore ( more_product_list ) 
    参数说明： 
              categoryId:  类型id
              belongShop: 所属店铺
              typeBelongShop: 所属店铺类别
              page: 第几页
              showType: 显示方式
              showColumn: 显示几列
              productName: 商品名称
              startPrice: 最低价格
              endPrice: 最高价格
              orderType: 排序方式

    返回的json说明: 商品的json数据

#### 三级列表 : search_product2

    页面功能 : 三级导航 
    页面主要处理函数: getData --> 获取商品列表信息
                    toAdverLink --> 广告图跳转
    使用接口：无
    参数说明： 
    返回的json说明: 

#### 列表页2 : product_tree_list

    页面功能 : 商品列表页面，类别查询，加入购物车
    页面主要处理函数: getData --> 获取商品列表信息
                    postParams --> 加减购物车内容
    使用接口：Client.Get.ProductListMore ( more_product_list ) 
             Client.User.ChangeCarItemCount（change_shopping_car_item）
    参数说明： 1.Client.Get.ProductListMore
                  categoryId:  类型id
                  belongShop: 所属店铺
                  typeBelongShop: 所属店铺类别
                  page: 第几页
                  showType: 显示方式
                  showColumn: 显示几列
                  productName: 商品名称
                  startPrice: 最低价格
                  endPrice: 最高价格
                  orderType: 排序方式
              2.Client.User.ChangeCarItemCount
                  productId:  商品ID
                  shopId: 所属店铺
                  count: 数量
                  cartesionId: 规格集ID
                  type: 类型(add dec change)
    返回的json说明: 1.Client.Get.ProductListMore
                      商品的json数据
                   2.Client.User.ChangeCarItemCount
                      加减商品成功后的json

#### 列表页3 : product_waimai 

    页面功能 : 商品列表页面，类别查询，加入购物车，购物车加减，创建订单
    页面主要处理函数: getData --> 获取商品列表信息
                    postParams --> 加减购物车内容
                    createOrder --> 创建订单
    使用接口：Client.Get.ProductListMore ( more_product_list ) 
             Client.User.ChangeCarItemCount（change_shopping_car_item）
             Client.User.ListPromotionsByCarItems（list_promotions_by_car_items）
             Client.User.CarItemsCreateOrder（shopping_car_list_item_create_order）
    参数说明： 1.Client.Get.ProductListMore
                  categoryId:  类型id
                  belongShop: 所属店铺
                  typeBelongShop: 所属店铺类别
                  page: 第几页
                  showType: 显示方式
                  showColumn: 显示几列
                  productName: 商品名称
                  startPrice: 最低价格
                  endPrice: 最高价格
                  orderType: 排序方式
              2.Client.User.ChangeCarItemCount
                  productId:  商品ID
                  shopId: 所属店铺
                  count: 数量
                  cartesionId: 规格集ID
                  type: 类型(add dec change)
              3.Client.User.ListPromotionsByCarItems
                  shopId:  所属店铺
                  selectedIds: 选中的商品
              4.Client.User.CarItemsCreateOrder
                  shopId:  所属店铺
                  selectedIds: 选中的商品

    返回的json说明: 1.Client.Get.ProductListMore
                      商品的json数据
                   2.Client.User.ChangeCarItemCount
                      加减商品成功后的json
                   3.Client.User.ListPromotionsByCarItems
                      这里应该有promotionId数组
                   4.Client.User.CarItemsCreateOrder
                      预下单后返回的订单号

#### 列表页4 : product_waimai_offline

    页面功能 : 商品列表页面，类别查询，加入购物车，购物车加减，创建订单（加减购物车和商品后存放本地，不经过服务器，更加流畅）
    页面主要处理函数: getData --> 获取商品列表信息
                    postParams --> 加减购物车内容
                    createOrder --> 创建订单
    使用接口：Client.Get.ProductListMore ( more_product_list ) 
             Client.User.ListPromotionsByCarItems（list_promotions_by_car_items）
             Client.User.CarItemsCreateOrder（shopping_car_list_item_create_order）
    参数说明： 1.Client.Get.ProductListMore
                  categoryId:  类型id
                  belongShop: 所属店铺
                  typeBelongShop: 所属店铺类别
                  page: 第几页
                  showType: 显示方式
                  showColumn: 显示几列
                  productName: 商品名称
                  startPrice: 最低价格
                  endPrice: 最高价格
                  orderType: 排序方式
              2.Client.User.ListPromotionsByCarItems
                  shopId:  所属店铺
                  selectedIds: 选中的商品
              3.Client.User.CarItemsCreateOrder
                  shopId:  所属店铺
                  selectedIds: 选中的商品

    返回的json说明: 1.Client.Get.ProductListMore
                      商品的json数据
                   2.Client.User.ListPromotionsByCarItems
                      这里应该有promotionId数组
                   3.Client.User.CarItemsCreateOrder
                      预下单后返回的订单号

#### 二级列表 : product_type2

    页面功能 : 二级列表 
    页面主要处理函数: getData --> 获取商品列表信息
                    toAdverLink --> 广告图跳转
    使用接口：无
    参数说明： 
    返回的json说明: 

#### 订单列表 : order_list

    页面功能 : 订单的一系列操作-查看订单详细，编辑订单，取消订单，删除订单，去支付，订单到货，评价
    页面主要处理函数: getOrderList --> 获取订单列表信息
                    lookMore --> 查看订单详细
                    editOrder --> 编辑订单
                    cancelOrder --> 取消订单
                    delectOrder --> 删除订单
                    pingjiaOrder --> 订单评价
                    arriverOrder --> 订单到货

    使用接口：Client.Order.OrderList ( get_order_list ) 
             Client.Order.OrderReceived （order_received）
             Client.Order.OrderUnshow （order_unshow）
             Client.Order.CancelOrder （cancel_order）

    参数说明： 1.Client.Order.OrderList 
                  easyStatus:  订单状态
                  orderNo: 订单号
                  page: 第几页
              2.Client.Order.OrderReceived
                  orderNo:  订单号
              3.Client.Order.OrderUnshow
                  orderNo:  订单号
              4.Client.Order.CancelOrder
                  orderNo:  订单号
    返回的json说明: 1.Client.Order.OrderList 
                      订单的json数据数组
                    2.Client.Order.OrderReceived
                        成功提示
                    3.Client.Order.OrderUnshow
                        成功提示
                    4.Client.Order.CancelOrder
                        成功提示

#### 订单详细 : order_detail

    页面功能 : 查看订单详细
    页面主要处理函数: getOrderDetail --> 获取订单详细信息
    使用接口：Client.Order.GetOrderDetail ( get_order_detail )
    参数说明： 1.Client.Order.GetOrderDetail
                  gotCouponListId:  领取优惠券id
                  orderNo: 订单号
    返回的json说明: 1.Client.Order.GetOrderDetail
                  当前订单的数据json


#### 编辑订单 : edit_order

    页面功能 : 编辑订单-添加地址，使用优惠券，使用积分抵扣，确认订单
    页面主要处理函数: showOtherArr --> 获取地址列表
                    toaddress_new --> 添加新地址
                    chooseNewAddr --> 选择地址
                    payWayChange --> 支付方式
                    getavailableCouponsArr --> 选择优惠券
                    getEditOrderDetail --> 获取订单详情
                    submitOrder --> 确认订单

    使用接口：Client.User.AddressList ( get_login_user_address_list ) 
             Client.Order.GetEditOrderDetail （ get_edit_order_detail ）
             Client.Order.SubmitOrder （ submit_order ）

    参数说明： 1.Client.User.AddressList
              2. Client.Order.GetEditOrderDetail
                  orderNo:  订单号
                  gotCouponListId : 用户领取优惠券id
                  expressNo : 快递策略号 -1 系统自动选择    0 不要策略到店自取
              3.Client.Order.SubmitOrder
                  orderNo:  订单号
                  addressId:  地址ID
                  buyerScript:  留言
                  payType:  支付类型
                  jifenDikou:  积分抵扣
    返回的json说明:  1.Client.User.AddressList
                        已添加的地址数组
                    2. Client.Order.GetEditOrderDetail
                        下单的详细信息
                    3.Client.Order.SubmitOrder
                       下单成功的返回数据 - 待付款



#### 提交订单完成与付款页面 : submit_order_result

    页面功能 : 付款
    页面主要处理函数: payByYue --> 余额支付
                    payByWechat --> 微信支付 --  统一下单

    使用接口：Client.Weixin.UnifinedOrder ( unifined_order ) 
             Client.Order.AccountPay （ order_account_pay ）

    参数说明： 1.Client.Weixin.UnifinedOrder
                  orderNo:  订单号
                  openid : 微信用户openid
                  app : 是否app 0 否  1 是
              2. Client.Order.AccountPay
                  orderNo:  订单号
             
    返回的json说明:  1.Client.Weixin.UnifinedOrder
                        返回统一下单的几大字符串
                        ---
                          'timeStamp': wechatPayStr.timeStamp,
                          'nonceStr': wechatPayStr.nonceStr,
                          'package': wechatPayStr.package,
                          'signType': wechatPayStr.signType,
                          'paySign': wechatPayStr.paySign,

                    2. Client.Order.AccountPay
                        余额支付，返回余额支付成功失败信息

#### 退货列表 : back_item_list

    页面功能 : 退货列表
    页面主要处理函数: getOrderList --> 获取订单列表
                    tuikuan --> 去退款页面
    使用接口： Client.User.BackItemList ( get_back_item_list ) 
    参数说明： 1. Client.User.BackItemList
                  platformNo:  平台号
                  secretCode : 口令
                  page : 页数
             
    返回的json说明:  1. Client.User.BackItemList
                        可退款的订单列表

#### 退货详情 : back_item_detail

    页面功能 : 退货页面
    页面主要处理函数: sureBackItem --> 确认退货
                    get_back_order_item_page --> 获取退款订单信息
    使用接口： Client.User.SendBackOrderItemReq ( send_back_order_item_req ) 
              Client.User.BackOrderItemPage ( get_back_order_item_page ) 
    参数说明： 1. Client.User.SendBackOrderItemReq
                  orderItemId:  订单项ID
                  backReason : 退款理由
              1. Client.User.BackOrderItemPage
                  orderItemId:  订单项ID
                  secretCode : 口令
                  platformNo : 平台号
    返回的json说明:  1. Client.User.SendBackOrderItemReq
                        发起退货-成功|失败 信息
                    2. Client.User.BackOrderItemPage
                        退货项信息

#### 评价订单 : order_shop_comment   

    页面功能 : 评价页面
    页面主要处理函数: addCommitImage --> 添加商品评论图片
                    addCommitScrollToData --> 把分数加到orderItem属性里面
                    productScroll --> 商品评分
                    commitProduct --> 商品评价
                    readyCommit_shop --> 准备评价店铺
                    getItem --> 获取被评价的订单数据

    使用接口： Client.Order.GetOrderDetail ( get_order_detail ) 
              Client.Order.CommentOrder ( comment_order ) 
              Client.Order.CommentOrder ( comment_order ) 
    参数说明： 1. Client.Order.GetOrderDetail
                  orderNo:  订单号
                  gotCouponListId : 领取优惠券id
              2. Client.Order.CommentOrder
                  orderNo:  订单号
                  shopId : 店铺ID
                  productId : 产品ID
                  commentContent:  评论
                  commentImages : 评论图片
                  niming : 匿名
                  pingfen:  评分
              3. Client.Order.CommentOrder
                  orderNo:  订单号
                  shopId : 店铺ID
                  shangpinfuhedu : 商品符合度
                  dianjiafuwutaidu:  店家服务态度
                  wuliufahuosudu : 物流发货速度
    返回的json说明:  1. Client.Order.GetOrderDetail
                         获取被评价的订单信息
                    2. Client.Order.CommentOrder
                        商品评价，
                    3. Client.Order.CommentOrder
                        店铺评价


#### 推荐品牌列表 : brand_list

    页面功能 : 推荐列表，关注推荐信息，取消关注
    页面主要处理函数: guanzhuDaShi --> 关注
                    removeGuanzhuDaShi --> 取消关注
                    getData --> 获取推荐列表数据

    使用接口： Client.Brand.GetBrandList ( get_brand_list ) 
              Client.User.AddToFavorite ( add_to_favorite ) 
              Client.User.RemoveFavorite ( remove_favorite ) 
    参数说明： 1. Client.Brand.GetBrandList
                  page:  页数
                  brandName : 品牌名
              2. Client.User.AddToFavorite
                  favoriteType:  收藏类型
                  itemId : 收藏对象Id
              3. Client.User.RemoveFavorite
                  favoriteType:  收藏类型
                  itemId : 收藏对象Id
                 
    返回的json说明:  1. Client.Brand.GetBrandList
                         获取推荐品牌列表
                    2. Client.User.AddToFavorite
                        加入收藏
                    3. Client.User.RemoveFavorite
                        取消收藏


#### 推荐品牌详细 : brand_detail

    页面功能 : 推荐品牌详细，关注推荐品牌，取消关注
    页面主要处理函数: guanzhuDaShi --> 关注
                    removeGuanzhuDaShi --> 取消关注
                    getData --> 获取推荐详情数据

    使用接口： Client.Brand.GetBrandDetail ( get_brand_detail ) 
              Client.User.AddToFavorite ( add_to_favorite ) 
              Client.User.RemoveFavorite ( remove_favorite ) 
    参数说明： 1. Client.Brand.GetBrandDetail
                  brandId : 品牌id
              2. Client.User.AddToFavorite
                  favoriteType:  收藏类型
                  itemId : 收藏对象Id
              3. Client.User.RemoveFavorite
                  favoriteType:  收藏类型
                  itemId : 收藏对象Id
                 
    返回的json说明:  1. Client.Brand.GetBrandList
                         获取推荐品牌详情
                    2. Client.User.AddToFavorite
                        加入收藏
                    3. Client.User.RemoveFavorite
                        取消收藏

#### 购物车 : shopping_car_list

    页面功能 : 加载购物车，添加商品数量，减，移除，清空，准备下单
    页面主要处理函数: getCart --> 获取购物车列表
                    postParams --> 加减购物车内容
    使用接口：Client.User.CarItemList  ( /get_shopping_car_list_item.html ) 
             Client.User.ChangeCarItemCount （ change_shopping_car_item ）
             Client.User.CarItemdDelete （ delete_shopping_car_list_item ）
             Client.User.ListPromotionsByCarItems （ list_promotions_by_car_items ）
             Client.User.CarItemsCreateOrder （ shopping_car_list_item_create_order ） 选种商品生成订单

    参数说明： 1.Client.User.CarItemList
              2.Client.User.ChangeCarItemCount
                  productId:  商品ID
                  shopId: 所属店铺
                  count: 数量
                  cartesionId: 规格集ID
                  type: 类型(add dec change)
              3.Client.User.CarItemdDelete
                  shopId: 所属店铺
                  selectedIds: 选中ID 以逗号分隔开
                  type: 类型(all selected shopall)

              4.Client.User.ListPromotionsByCarItems
                  selectedIds:  选中ID 以逗号分隔开
                  shopId: 所属店铺
              5.Client.User.CarItemsCreateOrder
                  selectedIds:  选中ID 以逗号分隔开
                  shopId: 所属店铺
                  promotionId:活动id

    返回的json说明:  1.Client.User.CarItemList
                        获取购物车信息
                    2.Client.User.ChangeCarItemCount
                        加减购物车数量
                    3.Client.User.CarItemdDelete
                        删除购物车商品或清空
                    4.Client.User.ListPromotionsByCarItems
                        准备下单，获取优惠商品信息
                    5.Client.User.CarItemsCreateOrder
                        去下单

#### 登录 : login


#### 注册 : regist
#### 用户协议 : regist_xieyi
#### 优惠券 : my_coupons
#### 获取优惠券 : available_coupons 
#### 收藏与喜欢 : my_favorite
#### 积分 	user_jifen_events
#### 个人资料 : pre_change_user_info
#### 我的消息 : message_counter2
#### 地址 : address
#### 添加新地址 : add_address
#### 我的足迹 : user_visit_items
#### 余额充值列表 : user_account_events
#### 余额充值页面 : user_recharge
#### 商品管理 : shop_manager_products