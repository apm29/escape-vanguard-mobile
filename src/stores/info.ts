import { acceptHMRUpdate, defineStore } from 'pinia'

export interface Disaster {
  name: string
  description: string
  icon: string
  id: string
  location: string
  distance: string
  action: string
}

export interface Shelter {
  name: string
  id: string
  location: string
  detail: string
  distance: string
  capacity: string
  facilities: string
}

export const useInfoStore = defineStore('info', () => {
  const disasters = reactive([
    {
      name: '地震',
      description: '地壳快速释放能量造成的强烈地面震动，可能引发建筑物倒塌、山体滑坡等次生灾害。',
      icon: 'i-carbon:earthquake',
      id: 'earthquake',
      location: '汀溪镇,城仔内里',
      distance: '2.5公里，威胁方向：东北',
      action: '1. 室内避险：躲至坚固家具旁或承重墙角落，护住头部<br/>2. 远离危险物：避开窗户、吊灯、高处家具<br/>3. 准备应急包：含手电筒、急救药品、3天食物饮水<br/>4. 震后检查燃气、电路，防止火灾',
    },
    {
      name: '山火',
      description: '森林或草原火灾，蔓延迅速且伴随浓烟，威胁生命和生态环境。',
      icon: 'i-carbon:fire',
      id: 'fire',
      location: '汀溪镇,城仔内里',
      distance: '2.5公里，威胁方向：东北',
      action: '1. 立即撤离：按疏散路线向逆风方向逃离<br/>2. 居家防护：关闭门窗，用湿布堵缝，移除周边可燃物<br/>3. 应急物资：准备防烟面具、湿毛巾、饮用水<br/>4. 关注火势通报，避免返回危险区',
    },
    {
      name: '洪涝',
      description: '暴雨或河流泛滥导致的积水淹没，易引发触电、溺水及水源污染。',
      icon: 'i-carbon:flood',
      id: 'flood',
      location: '汀溪镇,城仔内里',
      distance: '2.5公里，威胁方向：东北',
      action: '1. 向高处转移：避免涉水，远离电线杆、下水道<br/>2. 居家防护：用沙袋堵门，切断电源<br/>3. 应急物资：储备救生圈、浮具、净水药片<br/>4. 勿饮生水，警惕疫病传播',
    },
    {
      name: '台风',
      description: '强热带气旋伴随狂风暴雨，可能引发风暴潮、洪涝和建筑物损毁。',
      icon: 'i-carbon:windy',
      id: 'windy',
      location: '汀溪镇,城仔内里',
      distance: '2.5公里，威胁方向：东北',
      action: '1. 加固门窗：用胶带贴“米”字防碎裂<br/>2. 清理阳台：收回花盆、杂物，防高空坠物<br/>3. 储备物资：备足饮用水、充电宝、收音机<br/>4. 避免外出，远离广告牌、临时搭建物',
    },
    {
      name: '干旱',
      description: '长期缺水导致水资源短缺，影响农业、供水和生态环境。',
      icon: 'i-carbon:drought',
      id: 'drought',
      location: '汀溪镇,城仔内里',
      distance: '2.5公里，威胁方向：东北',
      action: '1. 节约用水：循环利用生活用水，减少浪费<br/>2. 储水准备：利用容器储存雨水或应急供水<br/>3. 农业应对：改种耐旱作物，采用滴灌技术<br/>4. 关注政府限水政策，配合节水措施',
    },
    {
      name: '人为事件',
      description: '恐怖袭击、犯罪活动等突发社会安全事件。',
      icon: 'i-carbon:notification',
      id: 'notification',
      location: '汀溪镇,城仔内里',
      distance: '2.5公里，威胁方向：东北',
      action: '1. 躲避隐藏：远离事发区域，寻找掩体保护<br/>2. 保持安静：关闭手机铃声，避免暴露位置<br/>3. 及时报警：拨打110提供现场信息<br/>4. 遵循警方指挥疏散',
    },
    {
      name: '公共卫生',
      description: '传染病疫情或食物中毒等威胁公共健康的紧急事件。',
      icon: 'i-carbon:health-cross',
      id: 'health',
      location: '汀溪镇,城仔内里',
      distance: '2.5公里，威胁方向：东北',
      action: '1. 个人防护：佩戴口罩，勤洗手消毒<br/>2. 减少聚集：避免前往人群密集场所<br/>3. 储备物资：准备常用药品、消毒剂、医用口罩<br/>4. 配合流调，及时上报症状',
    },
  ])

  const shelters = reactive([
    {
      name: '城仔内里',
      id: 'chengzineili',
      location: '汀溪镇,城仔内里',
      detail: '地址厦门市同安区汀溪镇城仔内里，联系人：张三，电话：13800138000',
      distance: '200米，步行大约3分钟',
      capacity: '5000人,剩余容量4000人',
      facilities: '饮用水、应急食品、急救站、卫生厕所、充电设备',
    },
    {
      name: '汀溪中学',
      id: 'tingxizhongxue',
      location: '汀溪镇,汀溪中学',
      detail: '地址厦门市同安区汀溪镇汀溪中学，联系人：李四，电话：13800138001',
      distance: '2000米，步行大约20分钟',
      capacity: '5000人,剩余容量4000人',
      facilities: '饮用水、应急食品、急救站、卫生厕所、充电设备',
    },
    {
      name: '澳溪中学',
      id: 'aoxizhongxue',
      location: '汀溪镇,澳溪中学',
      detail: '地址厦门市同安区汀溪镇澳溪中学，联系人：王五，电话：13800138002',
      distance: '1600米，步行大约12分钟',
      capacity: '3000人,剩余容量2010人',
      facilities: '饮用水、应急食品、急救站、卫生厕所、充电设备',
    },
    {
      name: '双溪流公园',
      id: 'shuangxiliu',
      location: '汀溪镇,双溪流公园',
      detail: '地址厦门市同安区汀溪镇双溪流公园，联系人：赵六，电话：13800138003',
      distance: '200米，步行大约3分钟',
      capacity: '1000人,剩余容量300人',
      facilities: '饮用水、应急食品、急救站、卫生厕所、充电设备',
    },
  ])

  const info = ref<Disaster | Shelter>(shelters[1])
  const infoType = ref<'disaster' | 'shelter'>('shelter')
  function setInfo(_info: Disaster | Shelter, _type: 'disaster' | 'shelter') {
    info.value = _info
    infoType.value = _type
  }
  function setInfoById(id: string, type: 'disaster' | 'shelter') {
    if (type === 'disaster') {
      info.value = disasters.find(d => d.id === id) as Disaster
    }
    else {
      info.value = shelters.find(s => s.id === id) as Shelter
    }
  }
  return {
    setInfo,
    setInfoById,
    disasters: readonly(disasters),
    shelters: readonly(shelters),
    info,
    infoType,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useInfoStore as any, import.meta.hot))
