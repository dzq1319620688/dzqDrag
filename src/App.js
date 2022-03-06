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
let taskList = [{
  id: 1,
  status: STATUS_TODO,
  content: 'dzq',
}]

function TaskItem(props) {
  const [isDelete,getIsDelete]=useState(true)
  
  function handleDragStart() {
    props.onDragStart(props.id);
  }
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
  function deleteIcon(){
    getIsDelete(!isDelete)
  }
  let { id, active,content, onDragEnd,itemDelete} = props;
  return (
    <div
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      id={`item-${id}`}
      onMouseOver ={deleteIcon}
      onMouseOut={deleteIcon}
      className={'item' + (active ? ' active' : '')}
      draggable="true"
    >
      <input value={content} onChange={changeText}></input>
      <img className="delete" onClick={()=>itemDelete(id)} style={{display:isDelete?"none":''}} src={require("./img/删除.png")}></img>
    </div>
  );
}

function TaskCol(props) {
  const [isOn, getIson] = useState(false)
  console.log(props)
  function handleDragEnter(e) {
    e.preventDefault();
    if (props.canDragIn) {
      getIson(true)
    }
  }
  function handleDragLeave(e) {
    e.preventDefault();
    if (props.canDragIn) {
      getIson(false)
    }
  }
  function handleDrop(e) {
    e.preventDefault();
    props.dragTo(props.status);
    getIson(false)
  }
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
  /**
   * 传入被拖拽任务项的 id
   */
  function onDragStart(id) {
    getActiveId(id)
  }

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

  function cancelSelect() {
    getActiveId(null)
  }
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
            addInput={addInput}
            canDragIn={activeId !== null}>
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
