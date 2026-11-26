/**
 * 地址级联选择器的 demo 数据：省 / 市 / 区 三级
 *
 * value 用国标行政区划编码，label 用于展示；
 * 只覆盖了少量省市，够 demo 用。接真实数据时有两种方式：
 * 1. 在 schema 的 option.options 里直接传完整数据（组件会优先用它）；
 * 2. 用 element-china-area-data 之类的包替换这份文件。
 */
export const AREA_OPTIONS = [
    {
        value: '110000',
        label: '北京市',
        children: [
            {
                value: '110100',
                label: '北京市',
                children: [
                    { value: '110101', label: '东城区' },
                    { value: '110102', label: '西城区' },
                    { value: '110105', label: '朝阳区' },
                    { value: '110106', label: '丰台区' },
                    { value: '110108', label: '海淀区' },
                ],
            },
        ],
    },
    {
        value: '310000',
        label: '上海市',
        children: [
            {
                value: '310100',
                label: '上海市',
                children: [
                    { value: '310101', label: '黄浦区' },
                    { value: '310104', label: '徐汇区' },
                    { value: '310106', label: '静安区' },
                    { value: '310115', label: '浦东新区' },
                ],
            },
        ],
    },
    {
        value: '320000',
        label: '江苏省',
        children: [
            {
                value: '320100',
                label: '南京市',
                children: [
                    { value: '320102', label: '玄武区' },
                    { value: '320106', label: '鼓楼区' },
                    { value: '320115', label: '江宁区' },
                ],
            },
            {
                value: '320500',
                label: '苏州市',
                children: [
                    { value: '320506', label: '吴中区' },
                    { value: '320508', label: '姑苏区' },
                ],
            },
        ],
    },
    {
        value: '330000',
        label: '浙江省',
        children: [
            {
                value: '330100',
                label: '杭州市',
                children: [
                    { value: '330102', label: '上城区' },
                    { value: '330106', label: '西湖区' },
                    { value: '330110', label: '余杭区' },
                ],
            },
            {
                value: '330200',
                label: '宁波市',
                children: [
                    { value: '330203', label: '海曙区' },
                    { value: '330212', label: '鄞州区' },
                ],
            },
        ],
    },
    {
        value: '440000',
        label: '广东省',
        children: [
            {
                value: '440100',
                label: '广州市',
                children: [
                    { value: '440103', label: '荔湾区' },
                    { value: '440104', label: '越秀区' },
                    { value: '440106', label: '天河区' },
                    { value: '440113', label: '番禺区' },
                ],
            },
            {
                value: '440300',
                label: '深圳市',
                children: [
                    { value: '440303', label: '罗湖区' },
                    { value: '440304', label: '福田区' },
                    { value: '440305', label: '南山区' },
                    { value: '440306', label: '宝安区' },
                ],
            },
        ],
    },
    {
        value: '510000',
        label: '四川省',
        children: [
            {
                value: '510100',
                label: '成都市',
                children: [
                    { value: '510104', label: '锦江区' },
                    { value: '510107', label: '武侯区' },
                    { value: '510112', label: '龙泉驿区' },
                ],
            },
        ],
    },
]

export default AREA_OPTIONS;
