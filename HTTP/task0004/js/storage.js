// 左侧分类对象

function Category(category) {
    this.category = category;
    return {
        category: this.category
    }
}
Category.prototype = {
    category:'默认分类'
}

// 中间列表
function TaskList(category, taskList) {
    this.category = category;
    this.taskList = taskList;
    return [category, taskList];
}
TaskList.prototype = ["默认分类", "使用说明"];

// 列表对象（单独每个）
function TaskDetail(taskList, title, time, content, isDone) {
    this.taskList = taskList;
    this.id = 0;
    this.time = time;
    this.title = title;
    this.content = content;
    this.isDone = isDone;
    return {
        id: this.id,
        cateList: this.taskList,
        time: this.time,
        title: this.title,
        content: this.content,
        isDone: this.isDone
    }
}
TaskDetail.prototype = {
    id: 0,
    cateList: ["默认分类","使用说明"],
    time: '2017-03-11',
    // JSON.stringify(2017-3-11) ---2003
    title: 'Readme',
    content: ''
        + '本应用使用原生Javascript开发，数据存储在本地硬盘。'
        + '<br>'
        + '支持两级分类。'
        + '<br>'
        + '左侧第一个按钮为添加分类按钮，支持添加主分类和子分类。'
        + '<br>'
        + '第二个按钮为添加任务按钮，请先选中子分类后再添加任务。'
        + '<br>'
        + '右侧上方分别为标记任务完成按钮和编辑按钮。'
        + '<br>'
        + '已完成的任务字体颜色将变淡。'
        + '<br>'
        + '支持删除分类，鼠标移动到分类列表将出现删除图标，谨慎删除，删除后不可恢复',
    isDone: true
};

var defaultCate = Category.prototype,
    defaultList = TaskList.prototype,
    defaultDetail = TaskDetail.prototype,

    // 主分类
    cate1 = new Category('IFE'),
    // cate1 {category: 'IFE'}

    // 子分类
    list1 = new TaskList('IFE', 'list1'),


    list2 = new TaskList('IFE', 'list2'),
    list3 = new TaskList('IFE', 'list3'),
    list4 = new TaskList('IFE', 'list4'),

    // 中间任务列表
    detail1 = new TaskDetail(list1, '重构task0001', '2017-03-20', '学习flex', true),
    detail2 = new TaskDetail(list2, '重构task0002', '2017-03-21', '重新学习DOM操作，完成拖拽', false),
    detail3 = new TaskDetail(list3, '完成task0003', '2017-03-13', '原生JS写一个TOLIST', false),
    detail4 = new TaskDetail(list3, '重构task0003', '2017-03-15', '尝试react', false),
    detail5 = new TaskDetail(list4, '完成task0004', '2017-03-28', '学习移动端适配',false),

    // 主分类cates, 子分类lists, 所有任务tasks

    cates = [defaultCate, cate1],
    // cates: [Category: '默认分类', Category: 'IFE']

    lists = [defaultList, list1, list2, list3, list4];
    tasks = [defaultDetail, detail1, detail2, detail3, detail4, detail5];

    // from util.js
    each(tasks, function (item, i) {
        item.id = i;
    });

// console.log(list1); // list1 ['IFE', 'task1']
// console.log(detail1.cateList)
// localstorage本地储存数据对象
var data = {
    cates: getData('cates'),
    lists: getData('lists'),
    tasks: getData('tasks')
};
// console.log(getData('cates'));
// console.log(getData('lists'));
function getData(keyName) {
    if (window.localStorage) {
        var storage = window.localStorage;
        // 检查之前有没有储存key
        if (!storage.getItem(keyName)) {
            switch (keyName) {
                case 'cates':
                    storage.setItem('cates', JSON.stringify(cates));
                    return JSON.parse(storage.getItem('cates'));
                    break;
                case 'lists':
                    storage.setItem('lists', JSON.stringify(lists));
                    return JSON.parse(storage.getItem('lists'));
                    break;
                case 'tasks':
                    storage.setItem('tasks', JSON.stringify(tasks));
                    return JSON.parse(storage.getItem('tasks'));
            }
            // console.log('get');
        }
        // console.log('get');
        return JSON.parse(storage.getItem(keyName));
    }
}
// console.log(data.cates);
function setData(keyName, value) {
    if (window.localStorage) {
        var storage = window.localStorage;
        if (storage.getItem(keyName)) {
            switch (keyName) {
                case 'cates':
                    storage.setItem('cates', JSON.stringify(value));
                    break;
                case 'lists':
                    storage.setItem('lists', JSON.stringify(value));
                    break;
                case 'tasks':
                    storage.setItem('tasks', JSON.stringify(value));
            }
        }
    } else {
        alert('Your explorer is not support localStorage');
    }
}
