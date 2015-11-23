'use strict';

var AppConstants = {
    protocol: 'http://',
    //protocol : 'https://',

    /*local test */
    applicationIp: 'm.us-app.com',

    applicationPrefix: 'usmvn/weixin',

    applicationPort: '8080',

    wxAppId: 'wx31332c571c074678',

    roles: [
        'redirect', //'public',
        'us_id',
        'result',
        'public'
    ],

    orientation: 1,

    accessLevels: {
        'couponResult': ['us_id', 'result'],
        'acquireCoupon': ['us_id'],
        'notAuth': ['redirect'],
        'notFound': '*'
    },

    vouchers: [
        {'group':'[5]','name':'10.00元'},
        {'group':'[6]','name':'20.00元'},
        {'group':'[7]','name':'30.00元'},
        {'group':'[8]','name':'75折'},
        {'group':'[5,5,6,6,7,7,8]','name':'大礼包'}
    ],



    getApiPrefix: function() {
        var apiPrefix = AppConstants.protocol + AppConstants.applicationIp + '/' + AppConstants.applicationPrefix;

        return apiPrefix;
    },

    queryString: function() {
        var queryString = {};
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            // If first entry with this name
            if (typeof queryString[pair[0]] === 'undefined') {
                queryString[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof queryString[pair[0]] === 'string') {
                var arr = [queryString[pair[0]], decodeURIComponent(pair[1])];
                queryString[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                queryString[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return queryString;
    },

    buildRoles: function(roles) {

        var bitMask = '01';
        var userRoles = {};

        for (var role in roles) {
            var intCode = parseInt(bitMask, 2);
            userRoles[roles[role]] = {
                bitMask: intCode,
                title: roles[role]
            };
            bitMask = (intCode << 1).toString(2);
        }
        return userRoles;
    },

    buildAccessLevels: function(accessLevelDeclarations, userRoles) {

        var accessLevels = {};
        for (var level in accessLevelDeclarations) {
            if (typeof accessLevelDeclarations[level] === 'string') {
                if (accessLevelDeclarations[level] === '*') {

                    var resultBitMasks = '';

                    for (var temRole in userRoles) {
                        resultBitMasks += '1';
                    }
                    //accessLevels[level] = parseInt(resultBitMask, 2);
                    accessLevels[level] = {
                        bitMask: parseInt(resultBitMasks, 2)
                    };
                }
            } else {
                var resultBitMask = 0;
                for (var role in accessLevelDeclarations[level]) {
                    if (userRoles.hasOwnProperty(accessLevelDeclarations[level][role]))
                        resultBitMask = resultBitMask | userRoles[accessLevelDeclarations[level][role]].bitMask;
                }
                accessLevels[level] = {
                    bitMask: resultBitMask
                };
            }
        }
        return accessLevels;
    },

    messages: {
        '无效的lot值': '对不起该红包已抢完'
    },


    redPackObj: {
        'title': 'US尊享券',
        'desc': '抢US尊享券，享免费入场及酒水。',
        'img': 'redpack.png'
    },

    sentences: [
        '终于摸到了我',
        '今晚就做你的人',
        '你还会再来玩我吗',
        '掘地三尺，领到了林黛玉',
        '嗯哼，叫我宝宝',
        '王总，下次再来啊～',
        '姐妹们的奖券真开心',
        '领到我的最美丽～',
        '#@%^*+$=',
        '嘻嘻，',
        '嘤嘤嘤~',
        '宝宝好开森~',
        '姿势不对，再来一次。',
        '床前明月光，隔壁老王睡得香',
        '无语了，这么大一个礼包',
        '开心哝，再来一次',
        '千呼万唤红包出来',
        '被自己帅气的外表惊到了',
        '不说话我就看看',
        '不想说话只想领红包',
        '么么哒～',
        '我想静静～',
        '哈哈、我就是静静～',
        '做个安静的美男子',
        'Join us，一起嗨皮',
        '就是这么任性，哼～',
        'woow～我就是party达人',
        'Join us, let’s party!',
        '摇摆摇摆摇摆～',
        ' I’m a good boy!',
        '没了寂寞还有红包',
        '姐是蒙娜丽莎',
        '哥玩pa是因为它伤神、不伤心！',
        '那些允许被挥霍的年代叫做青春',
        '做有良心的男人',
        '我怀旧，是因为我看不到未来。',
        '我太佩服我自己了',
        '年老的时候，镜子算是扯平了。',
        '有事直接奔主题',
        '我从不说谎，除啦这句话以外。',
        '一个人时，善待自己',
        '两个人时，善待对方',
        '小鸡炖蘑菇',
        '天王盖地虎',
        '00544',
        '44944',
        '人生如戏，全靠演技。',
        '真爱就像UFO,没人见过。',
        '后悔的事我不做',
        '我只做让你后悔的事。',
        '我是红包',
        '带我回家',
        '其实我是奥特曼。',
        '最美的不是下雨天',
        '是曾与你躲过雨的屋檐。',
        '你大爷的！',
        '我就是us，你值得拥有！',
        '姐一直都是神话。',
        '时而不靠谱，时而不着调。',
        '你猜',
        '你猜我猜不猜',
        '别逼我',
        '你的丑和你的脸没有关系。',
        '再过一百年',
        '就长成了参天大葱。',
        '骗子太多、傻子明显不够用。',
    ]


};

module.exports = AppConstants;
