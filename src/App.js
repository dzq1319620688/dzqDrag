import "./App.css"
import { useState } from "react";
const STATUS_TODO = 'STATUS_TODO';
const STATUS_DOING = 'STATUS_DOING';
const STATUS_DONE = 'STATUS_DONE';

const STATUS_CODE = {
  STATUS_TODO: 'Prepare to study',
  STATUS_DOING: 'Learming...',
  STATUS_DONE: 'Complete'
}
//初始数据
let taskList = [{
  id: 1,
  status: STATUS_TODO,
  content: 'dzq',
}]

function TaskItem(props) {
  // 是否显示删除图标
  const [isDelete,getIsDelete]=useState(true)
  
  //点击拖拽组件,获取id
  function handleDragStart() {
    props.onDragStart(props.id);
  }

  //改变输入框的值
  function changeText(e){
    console.log(props)
    let data=[]
    props.tasks.forEach((item)=>{
      if(item.id==props.id){
        item.content=e.target.value
        console.log(item)
      }
      data.push(item)
    })
    props.getTasks(data)
  }

  //显示关闭删除图标
  function deleteIcon(){
    getIsDelete(!isDelete)
  }
  let { id, active,content, onDragEnd,itemDelete} = props;
  return (
    <div
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onMouseOver ={deleteIcon}
      onMouseOut={deleteIcon}
      className={'item'}
      draggable="true"
    >
      <input value={content} onChange={changeText}></input>
      <img className="delete" onClick={()=>itemDelete(id)} style={{display:isDelete||active?"none":''}} src={require("./img/删除.png")}></img>
    </div>
  );
}

function TaskCol(props) {
  // 是否是拖拽组件当前所在的目标
  const [isOn, getIson] = useState(false)

  console.log(props)
  //拖拽组件进入当前组件
  function handleDragEnter(e) {
    e.preventDefault();
      getIson(true)
  }

  //拖拽组件离开当前组件
  function handleDragLeave(e) {
    e.preventDefault();
      getIson(false)
  }

  // 拖拽组件放入当前组件中
  function handleDrop(e) {
    e.preventDefault();
    props.dragTo(props.status);
    getIson(false)
  }

  //增加输入框
  function addSign(){
    if(props.status==STATUS_TODO){
      return (
        <div style={{textAlign:"center",marginTop:"10"}}>
          <img onClick={props.addInput} src={require("./img/增加.png")}></img>
        </div>
      )
    }
  }

  let { status, children } = props;
  return (
    <div
      id={`col-${status}`}
      className={'col'}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragEnter}
      onDrop={handleDrop}
    >
      <header className="col-header">
        {STATUS_CODE[status]}
      </header>
      <main className={'col-main' + (isOn ? ' active' : '')}>
        {children}
        {addSign()}
      </main>
    </div>
  );
}

function App() {
  const [tasks, getTasks] = useState(taskList)
  const [activeId, getActiveId] = useState(null)

 //传入被拖拽任务项的 id
  function onDragStart(id) {
    getActiveId(id)
  }

  //修改状态
  function dragTo(status) {
    let task;
    tasks.forEach((item)=>{
      if(item.id==activeId){
        task=item
      }
    });
    if (task.status !== status) {
      task.status = status;
      getTasks(tasks)
    }
    cancelSelect();
  }

  //拖拽结束时清空id
  function cancelSelect() {
    getActiveId(null)
  }

  //清除输入框
  function itemDelete(id){
    let data=[]
    tasks.forEach((item)=>{
      if(item.id==id){
        return
      }else{
        data.push(item)
      }
    })
    getTasks(data)
  }

  //新增输入框
  function addInput(){
    let data=[];
    let id=0;
    tasks.forEach((item)=>{
      data.push(item)
      if(item.id>=id){
        id=item.id+1
      }
    })
    data.push({
      id,
      status: 'STATUS_TODO',
      content: '',
    })
    getTasks(data)
  }
  return (
    <div className="task-wrapper">
      {
        Object.keys(STATUS_CODE).map(status =>
          <TaskCol
            status={status}
            key={status}
            dragTo={dragTo}
            addInput={addInput}>
              {/* 遍历tasks，是组件当前状态的返回true,生成输入框组件 */}
            {tasks.filter(t => t.status === status).map(t =>
              <TaskItem
                key={t.id}
                active={t.id === activeId}
                id={t.id}
                content={t.content}
                tasks={tasks}
                onDragStart={onDragStart}
                onDragEnd={cancelSelect}
                itemDelete={itemDelete}
                getTasks={getTasks}
              />)
            }
          </TaskCol>
        )
      }
    </div>
  )
}

export default App;
