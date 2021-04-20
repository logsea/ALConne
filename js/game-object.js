class Character{
    constructor(charMsg){
        this.level  = charMsg.level;
        this.exp    = charMsg.exp;
        this.expmax = charMsg.expmax;
        this.name   = charMsg.name;
        this.attrs   = {};
        for(let key of charMsg.attr){
            let value = equip.attrs[key];
            this.attrs[key] = value;
        }
        this.equips  = charMsg.equip;
    }
    getAttr(attrID){
        // 角色基础属性 = 角色原本属性+角色装备属性+阵营科技点（暂无）
        if(attrID != undefined || attrID != null){
            let baseValue = this.attr[attrID];
            for(let equip of this.equips){
                if(attrID in equip.attrs) baseValue += equip.attrs[attrID];
            }
            // TODO: 阵营科技点
            return baseValue;
        }
        let attrs = {}
        for(let attr in this.attrs){
            let baseValue = this.attr[attrID];
            for(let equip of this.equips){
                if(attrID in equip.attrs) baseValue += equip.attrs[attrID];
            }
            attrs[attr] = baseValue;
        }
        return attrs;
    }
}