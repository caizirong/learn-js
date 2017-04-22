// 初始化
(function () {
    // 初始化左上角返回按钮
    initBack();

    // 初始化左侧分类及子分类
    countAllTask();
    each(data.cates, addCate);
    each(data.lists, addList);

    // 初始化中间
    // 默认分类下的内容
    addMedium(data.tasks[0]);

    // 初始化右侧
    addRightContent(data.tasks[0]);

    // 初始化选中
    initSelected();

    // 初始化浮层下拉列表
    initSelectCate();

    // 初始化分类颜色
    initColor();

    // 初始化删除按钮
    initMinus();

    // 任务排序
    data.tasks.sort(compare('time'));

})();

// 增删改查后刷新数据
function updateData() {
    setData('cates', data.cates);
    setData('lists', data.lists);
    setData('tasks', data.tasks);
}

// 点击查看所有任务
$.click($('#allTasks'), showAll)
function showAll() {
    // 移动端
    ingBack();      // 返回按钮
    addClass($('#back'), 'ing');
    addClass($('.leftCate')[0], 'active');  // 整张页面左移


    if ($('.selectedCate')[0]) {
        removeClass($('.selectedCate')[0], 'selectedCate'); // 移除初始化样式
    }
    addClass($('#allTasks'), 'selectedCate');   // 添加选中样式
    // 展示所有任务
    $('#tasksList').innerHTML = '';
    // sortDate();
    each(data.tasks, function (task) {
        $('#tasksList').innerHTML += '<li><ul class = data-task isDone ='+ task.isDone + '><li class="task-time">' +task.time+ '</li><li class = task-title>'  +task.title+'</li></ul></li>'
    })
    initColor();
}

// 比较算法
function compare(properyName){
    return function(obj1,obj2) {
        var val1 = obj1[properyName];
        var val2 = obj2[properyName];
        if (val1 < val2) {
            return -1;
        }
        else if (val1 > val2) {
            return 1;
        }
        else {
            return 0;
        }
    }
}

// 初始化下拉框
function initSelectCate() {
    updateData();
    var num = 1;
    // 默认主分类
    $('#selectCate').innerHTML = '<option value = 0 >' + '新增主分类' + '</option>';
    each(data.cates, function (cate) {
        $('#selectCate').innerHTML += '<option value =' + num + '>' + cate.category + '</option>';
        num++;
    })
}

// 初始化分类列表，任务列表，任务状态选中样式
function initSelected() {
    // addClass($('[data-cate-id=默认分类]'), 'selected');  会连带子节点一起取到
    // addClass($('#cateList span')[1], 'selected')
    addClass($('[data-list-id=使用说明]'), 'selectedCate');
    addClass($('#all'), 'selectedStatus');
    addClass($('.task-title')[0], 'selectedTask');
}

// 计算所有任务数
function countAllTask() {
    $('#taskNum').innerHTML = '(' + toCount('allTasks') + ')';
}

// 初始化左侧分类
function addCate(obj) {
    var liCate = $('[data-cate-id=' + obj.category + ']');
    if (!liCate) {
        liCate = document.createElement('li');
        liCate.setAttribute('data-cate-id', obj.category);
        liCate.innerHTML =  '<h3><span class="fa fa-folder-open fa-fw"></span>'
        + obj.category + '(' + toCount('data.cates', obj.category) + ')' + '<span class="fa fa-minus-circle cate"></span>';
        $('#cateList').appendChild(liCate);

    }
}
// 初始化左侧子分类
function addList(obj) {
    var liList = $('[data-cate-id=' + obj[0] + ']');
    // new TaskList出来的对象是数组
    if (!liList.getElementsByTagName('ul')[0]) {
        cateList = document.createElement('ul');
        cateList.setAttribute('data-cate-id', obj[0]);
        cateList.className = 'data-cate';
        cateList.style.padding = '0 0 0 20px';
        cateList.innerHTML=  '<li data-list-id=' + obj[1] + '><span class="fa fa-file-o fa-fw"></span>'
        + obj[1] + '(' + toCount('data.lists', obj[1]) + ')' + '<span class="fa fa-minus-circle list"></span></li>';
        liList.appendChild(cateList);
        return; // 不return会重复第一个任务
    }
    if (liList.getElementsByTagName('ul')[0]) {
        liList.getElementsByTagName('ul')[0].innerHTML +=  '<li data-list-id=' + obj[1] + '><span class="fa fa-file-o fa-fw"></span>'
    + obj[1] + '(' + toCount('data.lists', obj[1]) + ')'+ '<span class="fa fa-minus-circle list"></span></li>';
    }
}
// 鼠标点击切换样式
// 取所有子分类
var listItem = [],
    cateList = $('.data-cate'),
    statusList = $('.data-status'),
    tasksList = $('.data-lists');

// 切换样式
// 无论点击多少次都应该是只添加一次类名
// 所以添加类名前应该先判断是否已经有‘selected'

// TODO
// 有冗余的代码
function changeClassName(event) {
    stopBubble();
    updateData();
    event = event || window.event;
    var target = event.target || event.srcElement;
    // stopBubble(event);
    if (target.parentNode) {
        var cateClassName = 'selectedCate', // 左侧子分类
            statusClassName = 'selectedStatus', // 中部状态栏
            taskClassName = 'selectedTask', // 中部单项任务
            targetParentClassName = target.parentNode.className;
        switch (targetParentClassName) {
            case 'data-cate':
                // 在分类列表里进行切换时
                // 如果之前选中了所有任务
                // 要移除样式
                if (hasClass($('#allTasks'), 'selectedCate')) {
                    removeClass($('#allTasks'), 'selectedCate');
                }

                for (var i = 0; i < cateList.length; i++) {
                    updateData();
                    var liList = cateList[i].getElementsByTagName('li');
                    each(liList, function (item) {
                        listItem.push(item);
                        // console.log(listItem);

                    })
                }

                for (var i = 0; i < listItem.length; i++) {
                    if (listItem[i].className === cateClassName) {
                        removeClass(listItem[i], cateClassName);
                    }
                }
                listItem = []; // 不然每次点击都会叠加listItem
                addClass(target, cateClassName);
                break;

            // TODO
            case 'data-status':
                // $('#all').className = '';
                // $('#finished').className = '';
                // $('#unfinished').className = '';  // 这样会有class,但是为空,html标签内会有空的class
                removeClass($('#all'), statusClassName);
                removeClass($('#finished'), statusClassName);
                removeClass($('#unfinished'), statusClassName);
                addClass(target, statusClassName);

                var id = target.id, // 选中状态id
                    listId, // 选中子分类名称
                    data_tasks = $('.data-task'), // 中间显示的所有任务（时间+标题的ul）
                    data_lists = document.querySelectorAll('[data-list-id]'); // 取左侧所有子分类

                    each(data_lists, function (item) {  // 在所有子分类中选出选中的那一个
                        if (hasClass(item, cateClassName)) {
                            listId = item.getAttribute('data-list-id');
                        }
                    })
                $('#tasksList').innerHTML = '';
                // 子分类的status切换
                if (!hasClass($('#allTasks'), 'selectedCate')) {
                    if (id === 'all') {

                        each(data.tasks, function (task) {
                            if (task.cateList[1] === listId) {
                                $('#tasksList').innerHTML += '<li><ul class = data-task isDone ='+ task.isDone + '><li class-"task-time">' +task.time+ '</li><li class = task-title isDone ='+ task.isDone + '>'+task.title+'</li></ul></li>';
                            }
                        });
                        initColor();

                    } if (id === 'finished') {
                        each(data.tasks, function (task) {
                            if (task.cateList[1] === listId && task.isDone) {
                                $('#tasksList').innerHTML += '<li><ul class = data-task isDone ='+ task.isDone + '><li class="task-time">' +task.time+ '</li><li class = task-title isDone ='+ task.isDone + '>'+task.title+'</li></ul></li>';
                            }
                        });
                        initColor();
                    } if (id === 'unfinished') {
                        each(data.tasks, function (task) {
                            if (task.cateList[1] === listId && !task.isDone) {
                                $('#tasksList').innerHTML += '<li><ul class = data-task isDone ='+ task.isDone + '><li class="task-time">' +task.time+ '</li><li class = task-title isDone ='+ task.isDone + '>'+task.title+'</li></ul></li>';
                            }
                        });
                    }
                }

                // 所有任务的status切换
                if (hasClass($('#allTasks'), 'selectedCate')) {
                    if (id === 'all') {
                        each(data.tasks, function (task) {

                                $('#tasksList').innerHTML += '<li><ul class = data-task isDone ='+ task.isDone + '><li class="task-time">' +task.time+ '</li><li class = task-title isDone ='+ task.isDone + '>'+task.title+'</li></ul></li>';

                        });
                        initColor();
                    } if (id === 'finished') {
                        each(data.tasks, function (task) {
                            if (task.isDone) {
                                $('#tasksList').innerHTML += '<li><ul class = data-task isDone ='+ task.isDone + '><li class="task-time">' +task.time+ '</li><li class = task-title isDone ='+ task.isDone + '>'+task.title+'</li></ul></li>';
                            }
                        });
                        initColor();
                    } if (id === 'unfinished') {

                        each(data.tasks, function (task) {
                            if (!task.isDone) {
                                $('#tasksList').innerHTML += '<li><ul class = data-task isDone ='+ task.isDone + '><li class="task-time">' +task.time+ '</li><li class = task-title isDone ='+ task.isDone + '>'+task.title+'</li></ul></li>';
                            }
                        });
                    }
                }

                break;
            case "data-task":
                var taskAll = tasksList[0].querySelectorAll('.task-title');

                for (var i = 0; i < taskAll.length; i++) {

                    if (taskAll[i] === target) {
                        each(taskAll, function (item) {
                            if (hasClass(item, taskClassName)) {
                                removeClass(item, taskClassName);
                            }
                        })
                        addClass(target, taskClassName);
                    }
                }
                break;
            }
    }
}
delegateClickEvent(cateList, changeClassName);
delegateClickEvent(statusList, changeClassName);
delegateClickEvent(tasksList, changeClassName);


// 点击子分类切换任务清单
// 通过getAttribute取子分类名字（不含未完成任务数）
// TODO
function changeMedium(event) {
        updateData();

        // 移动端
        ingBack();
        stopBubble();
        if (!hasClass($('.leftCate')[0], 'active')) {
            addClass($('.leftCate')[0], 'active');
        }

        event = event || window.event;
        var target = event.target || event.srcElement;
        var listId = target.getAttribute('data-list-id');
        var text = $('.selectedStatus')[0].innerText;
        $('#tasksList').innerHTML = '';
        each(data.tasks, function (task) {
            if (task.cateList[1] === listId && text === '所有') {
                $('#tasksList').innerHTML += '<li><ul class = data-task isDone ='+ task.isDone + '><li class="task-time">' +task.time+ '</li><li class = task-title isDone ='+ task.isDone + '>'+task.title+'</li></ul></li>';
                initColor();
            } if (task.cateList[1] === listId && text === '已完成' && task.isDone) {
                if (task.cateList[1] === listId ) {
                    $('#tasksList').innerHTML += '<li><ul class = data-task isDone ='+ task.isDone + '><li class="task-time">' +task.time+ '</li><li class = task-title isDone ='+ task.isDone + '>'+task.title+'</li></ul></li>';
                }
                initColor();
            } if (task.cateList[1] === listId && text === '未完成' && !task.isDone) {
                        if (task.cateList[1] === listId ) {
                            $('#tasksList').innerHTML += '<li><ul class = data-task isDone ='+ task.isDone + '><li class="task-time">' +task.time+ '</li><li class = task-title isDone ='+ task.isDone + '>'+task.title+'</li></ul></li>';
                        }

            }
        })

}
delegateClickEvent(cateList, changeMedium);

// 右侧显示任务详情
function changeRight(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;
    if (hasClass(target, 'task-title')) {

        // 移动端
        ingBack();
        if (!hasClass($('.midTask')[0], 'active')) {
            addClass($('.midTask')[0], 'active');
        }

        var text = target.innerText;
        each(data.tasks, function (task) {
            if (task.title === text) {
                $('#hidTitle').innerHTML = task.title;
                $('#hidDate').innerHTML = task.time;
                $('#taskContent').innerHTML = task.content;
            }
        })
    }
}
delegateClickEvent(tasksList, changeRight);

function toCount(arr, type) {
    // TODO
    // 在新增任务时如何同步求未完成数
    updateData();
    var count = 0;
    switch (arr) {
        case 'allTasks':
            each(data.tasks, function (task) {
                count++;
            })
        case 'data.lists':
            each(data.tasks, function (task) {
                if (!task.isDone && task.cateList[1] === type) {
                    count++;
            }
        });
            return count;
            break;
        case 'data.cates':
            each(data.tasks, function (task) {
                if (!task.isDone && task.cateList[0] === type) {
                    count++;
                }
            })
            return count;
            break;
        case 'data.tasks':
            each(data.tasks, function (task) {
                if (!task.isDone) {
                    count++;
                }
            });
            return count;
    }
}

// 调加中部任务列表
function addMedium(obj) {
    $('#tasksList').innerHTML = '<li><ul class = data-task isDone ='+ obj.isDone + '><li class="task-time">' +obj.time+ '</li><li class = task-title>'  +obj.title+'</li></ul></li>'
}

// 添加右侧详情
function addRightContent(obj) {
    $('#hidTitle').innerHTML = obj.title;
    $('#hidDate').innerHTML = obj.time;
    $('#taskContent').innerHTML = obj.content;
}

// 添加分类
// 左侧添加分类按钮
var addCate = $('#addCate'),
    cancel = $('#cancel'),
    close = $('#close'),
    sure = $('#sure'),
    coverStyle = $('#cover').style,
    selectCate = $('#selectCate');

    // newCateName = $('#newCateName').value
    // XXX：不要在这里设置，这样newCateName是''

var cate, node, newCateName, outCateName;
// 监听下拉框改变分类名
selectCate.onchange = function () {
    each(selectCate, function (theCate) {
        if (theCate.selected) {
            newCateName = $('#newCateName').value; // 新建子分类名
            cate = theCate.innerHTML;
            if (cate === '新增主分类') {
                outCateName = $('#newCateName').value;
            }

        }
    });
}
$.click(cancel, function () {
    // console.log('cancel add cate');
    coverStyle.display = 'none';
});

$.click(close, function () {
    // console.log('cancel add cate');
    coverStyle.display = 'none';
});

// 确认按钮
$.click(sure, addACate);
function addACate() {
    node = document.createElement('li');
    // 新增主分类
    if ($('#selectCate')[0].selected) {
        var outCateName = $('#newCateName').value;
        node.setAttribute('data-cate-id', outCateName);
        node.innerHTML = '<h3><span class="fa fa-folder-open fa-fw"></span>'
        + outCateName + '(' + toCount('data.cates', outCateName) + ')' + '<span class="fa fa-minus-circle cate"></span></h3><ul data-cate-id=' + outCateName + '' + ' class="data-cate" style="padding: 0px 0px 0px 20px;"></ul>';
        $('#cateList').appendChild(node);
        outCateName = new Category(outCateName);
        data.cates.push(outCateName);
        updateData();
        delegateClickEvent($('.data-cate'), changeClassName);
        initSelectCate(); // 更新下拉框
    }
    if (!$('#selectCate')[0].selected) {
        // node = document.createElement('li');
        var newCateName = $('#newCateName').value;
        node.setAttribute('data-list-id', newCateName);
        node.innerHTML ='<span class="fa fa-file-o fa-fw"></span>' + newCateName + '(' + toCount('data.lists', newCateName) + ')'+ '<span class="fa fa-minus-circle list"></span>';
        $('[data-cate-id='+cate+']').children[1].appendChild(node);
        removeClass($('.selectedCate')[0], 'selectedCate');
        addClass(node, 'selectedCate');
        // 本地保存
        newCateName = new TaskList(cate, newCateName);
        data.lists.push(newCateName);
        updateData();
        delegateClickEvent($('.data-cate'), changeClassName);
        delegateClickEvent($('.data-cate'), changeMedium);
        // TODO：正则排除重复空类名
    }
    coverStyle.display = 'none';
    initMinus();
}
$.on(addCate, 'click', function () {
    // 不保留上次选中项
    $('#selectCate').options[0].selected = true; // 设置默认显示文本
    coverStyle.display = 'block';
    $('#newCateName').value = '';
});

// 最右侧
// 标记完成按钮
$.click($('#done'), doneTask);
function doneTask() {
        if (confirm("确定标记任务完成吗？")) {
            var title = $('.selectedTask')[0].innerHTML;
            each(data.tasks, function (task) {
                if (task.title === title) {
                    task.isDone = true;
                }
            $('.selectedTask')[0].style.color = 'rgba(0, 0, 0, 0.24)'
            // console.log('check task')
            })
            updateData();
        } else {
            return;
        }

}

// 编辑按钮
$.click($('#edit'), editTask);
function editTask() {
    $('.rightContent')[0].style.display = 'none';
    $('.rightHide')[0].style.display = 'block';
    // 初始化编辑界面
    $('#inputTitle').value = $('#hidTitle').innerHTML;  // 任务标题
    $('#inputDate').value = $('#hidDate').innerHTML // 任务时间
    $('#inputContent').value = $('#taskContent').innerHTML; // 任务内容

}


// 保存编辑按钮
// 分为两部分
// 编辑任务后保存
// 新建任务后保存
$.click($('#save'), saveEdit);
function saveEdit() {

    $('.rightContent')[0].style.display = 'block';
    $('.rightHide')[0].style.display = 'none';
    // XXX：刷新页面，本地数据没有刷新
    $('#hidTitle').innerHTML = $('#inputTitle').value; // 更新标题
    $('#hidDate').innerHTML = $('#inputDate').value; // 更新日期
    var reg=new RegExp("\r\n","g");
    $('#taskContent').innerHTML = $('#inputContent').value
    // $('#taskContent').innerText = $('#inputContent').value.replace(reg, "<br>") // 更新内容

    // 如何更改task的content
    // 而不是只更改taskcontent的innerHTML
    // 要再次遍历data.tasks？判断title是否相同然后改？

    // TODO(繁琐)
    // 刷新数据
    if ($('.selectedTask')[0]) {
    each(data.tasks, function (task) {
        // 为了避免与新增任务的保存按钮冲突，$('.selectedTask')[0]起了作用
        var title;

            title = $('.selectedTask')[0].innerHTML;    // 选中任务的标题

            if (task.title === title) {
                task.title = $('#inputTitle').value;        // 标题
                task.time = $('#inputDate').value;          // 日期
                task.content = $('#inputContent').value;    // 任务内容
                $('.selectedTask')[0].innerHTML = $('#hidTitle').innerHTML; // 更新选中任务标题
                $('.selectedTask')[0].previousSibling.innerHTML = $('#hidDate').innerHTML; // 选中任务时间

            }

        updateData();
    })}
    if (!$('.selectedTask')[0]) {
        var pra1 = $('.selectedCate')[0].parentNode.getAttribute('data-cate-id');   // 主分类
        var pra2 = $('.selectedCate')[0].getAttribute('data-list-id') // 子分类
        var newTaskList = new TaskList(pra1, pra2);
        var newTask = new TaskDetail(newTaskList, $('#inputTitle').value, $('#inputDate').value, $('#inputContent').value, false);
        data.tasks.push(newTask);

        updateData();
        var listName = $('.selectedCate')[0].getAttribute('data-list-id');
        var tasks = [];
        each(data.tasks, function (task) {
            if (task.cateList[1] === listName) {
                tasks.push(task);
            }
        })
        data.tasks.sort(compare('time'));
        $('#tasksList').innerHTML = '';
        each(tasks, function (task) {
            $('#tasksList').innerHTML += '<li><ul class = data-task isDone ='+ task.isDone + '><li class="task-time">' +task.time+ '</li><li class = task-title>'  +task.title+'</li></ul></li>'
        })
        // 初始化左侧分类及子分类
        countAllTask();
        updateData();
        each(data.cates, addCate);
        each(data.lists, addList);
    }

}

// 添加任务
$.click($('#addTask'), addATask);
function addATask() {
    addClass($('.midTask')[0], 'active');
    $('#inputTitle').value = '';
    $('#inputContent').value = '';
    $('#inputDate').value = '';
    $('.rightContent')[0].style.display = 'none';
    $('.rightHide')[0].style.display = 'block';
    // 初始化编辑界面
    if ($('.selectedTask')[0]) {
        removeClass($('.selectedTask')[0], 'selectedTask');
    }

    initMinus();
}


// 取消编辑按钮
$.click($('#return'), returnEdit);
function returnEdit() {
    $('.rightContent')[0].style.display = 'block';
    $('.rightHide')[0].style.display = 'none';
}

// 删除分类
delegateClickEvent($('.fa-minus-circle'), deleteCate);
function deleteCate(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;
    var father;      // [data-list-id]
    var dataid; // 'list2'
    var grandFather;  // [data-cate-id]
    // 删除子分类
    if (hasClass(target, 'list')) {
        father = target.parentNode;      // [data-list-id]
        grandFather = father.parentNode; // [data-cate-id]
        dataid = father.getAttribute('data-list-id'); // 'list2'
        grandFather.removeChild(father);
        for (var i = 0; i < data.lists.length; i++) {
            if (data.lists[i][1] === dataid) {
                data.lists.splice(i, 1);
            }
        }
        for (var j = 0; j < data.tasks.length; j++) {
            if (data.tasks[j].cateList[1] === dataid) {
                data.tasks.splice(j, 1);
                j-=1; // 不然只能删除一个任务
            }
        }
        updateData();
    }
    // 删除主分类
    if (hasClass(target, 'cate')) {
        father = target.parentNode.parentNode;      // [data-list-id]
        grandFather = father.parentNode;
        dataid = father.getAttribute('data-cate-id');
        grandFather.removeChild(father);
        for (var k = 0; k < data.cates.length; k++) {
            if (data.cates[k].category === dataid) {
                data.cates.splice(k, 1);
            }
        }
        for (var i = 0; i < data.lists.length; i++) {
            if (data.lists[i][0] === dataid) {
                data.lists.splice(i, 1);
                i-=1;
            }
        }
        for (var j = 0; j < data.tasks.length; j++) {
            if (data.tasks[j].cateList[0] === dataid) {
                data.tasks.splice(j, 1);
                j-=1; // 不然只能删除一个任务
            }
        }
        updateData();
    }
}
function initMinus() {
    updateData();
    var datalists = document.querySelectorAll('[data-list-id]'), // 取拥有特定属性的元素集合
        cates = document.querySelectorAll('li'),
        datacates = $('h3');
        // datacates = cate.getAttributeNodes('[data-cate-id]');
    if (window.innerWidth > parseInt('770px')) {
        each(datalists, function (list) {
        var minus = list.children[1];
        list.onmouseenter = function () {
            minus.style.opacity = 1;
        }
        list.onmouseleave = function () {
            minus.style.opacity = 0;
        }
        })
        each(datacates, function (cate) {
            var minus = cate.children[1];
            cate.onmouseenter = function () {
                minus.style.opacity = 1;
            }
            cate.onmouseleave = function () {
                minus.style.opacity = 0;
            }
        })
    }
}

function initColor() {

    each($('.data-task'), function (task) {
        if (task.getAttribute('isDone') === 'true') {
            task.style.color = 'rgba(0, 0, 0, 0.24)';
        }
    });
}

$.click($('#back'), function () {
    var cateLeftPre = $('.leftCate')[0].getBoundingClientRect().left;
    var taskLeftPre = $('.midTask')[0].getBoundingClientRect().left;
    var contentLeft = $('.rightContent')[0].getBoundingClientRect().left;
    if (cateLeftPre === - window.innerWidth && taskLeftPre === 0) {
        // removeClass($('.leftCate')[0],'active');
        $('.leftCate')[0].className = 'leftCate';
        initBack();
    }
    else {
        if ($('.rightContent')[0].style.display === 'none') {
            if (confirm('内容还未保存，确认离开吗？')) {
                $('.rightContent')[0].style.display = 'block';
                $('.rightHide')[0].style.display = 'none';
            } else {
                return;
            }

        }
        $('.midTask')[0].className = 'midTask';
    }
});

// 设配移动端
// 左上方返回按钮
function initBack() {
    $('#back').style.visibility = 'hidden';
}

// 设配移动端
// 运行时左上方返回按钮的状态
function ingBack() {
    if (window.innerWidth < parseInt('770px')) {
        console.log(window.innerWidth);
        $('#back').style.visibility = 'visible';
    }
}
