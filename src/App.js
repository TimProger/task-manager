import s from './App.module.scss';
import {useEffect, useState} from "react";
import {_Storage} from "./utils/_Storage";

function App() {

  const [blocks, setBlocks] = useState([])
  const [open, setOpen] = useState([-1, 0])

  useEffect(()=>{
    const data = _Storage.get('blocks')
    if(data){
      setBlocks([...JSON.parse(data)])
    }
  },[])

  const addBlock = () => {
    const obj = {
      id: blocks.length > 0 ? blocks[blocks.length-1].id + 1 : 0,
      name: "",
      tasks: []
    }
    _Storage.set('blocks', JSON.stringify([...blocks, obj]))
    setBlocks(prev => [...prev, obj])
  }

  const addTask = (block_id) => {
    const block = blocks.filter((el)=>el.id === block_id)
    if(block[0]) {
      const index1 = blocks.indexOf(block[0])
      const obj = {
        id: blocks[index1].tasks.length > 0 ? blocks[index1].tasks[blocks[index1].tasks.length - 1].id + 1 : 0,
        edit: false,
        name: ''
      }
      blocks[index1].tasks.push(obj)
      _Storage.set('blocks', JSON.stringify([...blocks]))
      setBlocks(prev => [...prev])
    }
  }

  const removeTask = (e, block_id, task_id) => {
    e.stopPropagation()
    const block = blocks.filter((el)=>el.id === block_id)
    if(block[0]) {
      const index1 = blocks.indexOf(block[0])
      const task = blocks[index1].tasks.filter((el)=>el.id === task_id)
      console.log(task, task_id)
      if(task[0]){
        const index2 = blocks[index1].tasks.indexOf(task[0])
        blocks[index1].tasks.splice(index2, 1)
        _Storage.set('blocks', JSON.stringify([...blocks]))
        setBlocks([...blocks])
      }
    }
  }

  const removeBlock = (block_id) => {
    const block = blocks.filter((el)=>el.id === block_id)
    if(block[0]){
      const index = blocks.indexOf(block[0])
      blocks.splice(index, 1)
      _Storage.set('blocks', JSON.stringify([...blocks]))
      setBlocks([...blocks])
    }
  }

  const openEditTask = (e, block_id, task_id) => {
    e.stopPropagation()
    const block = blocks.filter((el)=>el.id === block_id)
    if(block[0]){
      const index1 = blocks.indexOf(block[0])
      const task = blocks[index1].tasks.filter((el)=>el.id === task_id)
      if(task[0]){
        const index2 = blocks[index1].tasks.indexOf(task[0])
        blocks[index1].tasks[index2].edit = true
        setOpen([block_id, task_id])
        _Storage.set('blocks', JSON.stringify([...blocks]))
        setBlocks([...blocks])
      }
    }
  }

  const editTask = (e, block_id, task_id) => {
    const block = blocks.filter((el)=>el.id === block_id)
    if(block[0]){
      const index1 = blocks.indexOf(block[0])
      const task = blocks[index1].tasks.find((el)=>el.id === task_id)
      if(task){
        const index2 = blocks[index1].tasks.indexOf(task)
        blocks[index1].tasks[index2].name = e.target.value
        _Storage.set('blocks', JSON.stringify([...blocks]))
        setBlocks([...blocks])
      }
    }
  }

  const editBlock = (e, block_id) => {
    const block = blocks.filter((el)=>el.id === block_id)
    if(block[0]){
      const index1 = blocks.indexOf(block[0])
      blocks[index1].name = e.target.value
      _Storage.set('blocks', JSON.stringify([...blocks]))
      setBlocks([...blocks])
    }
  }

  document.addEventListener('click', ()=> {
    if(open[0] !== -1){
      blocks.forEach((el)=>el.tasks.forEach((el)=>el.edit = false))
      _Storage.set('blocks', JSON.stringify([...blocks]))
      setBlocks([...blocks])
      setOpen([-1, 0])
    }
  })

  const [currentTask, setCurrentTask] = useState([{}, -1])

  const onDragStart = (e, elem, index) => {
    setCurrentTask([elem, index])
  }

  const onDragEnd = (e) => {
    e.preventDefault()
    if(e.target.className.split(' ')[0] === s.container__block){
      e.classList.remove(s.container__block__over)
    }
  }

  const onOver = (e) => {
    e.preventDefault()
    let blocks = document.querySelectorAll(`.${s.container__block}`)
    blocks.forEach((el)=>{
      el.classList.remove(s.container__block__over)
    })
    if(e.target.className.split(' ')[0] === s.container__block){
      e.target.classList.add(s.container__block__over)
    }
  }

  const onDrop = (e, block_id) => {
    e.preventDefault()
    if(e.target.className.split(' ')[0] === s.container__block){
      e.target.classList.remove(s.container__block__over)
    }
    const block = blocks.filter((el)=>el.id === block_id)
    if(block[0]) {
      const index1 = blocks.indexOf(block[0])
      const obj = Object.assign(
        {
          id: blocks[index1].tasks.length > 0 ? blocks[index1].tasks[blocks[index1].tasks.length-1].id + 1 : 0
        }, JSON.parse(JSON.stringify(currentTask[0])))
      blocks[index1].tasks.push(obj)
      const includes = blocks.filter((el)=>{
        return el.id === currentTask[1]
      })
      if(includes[0]){
        const index2 = blocks.indexOf(includes[0])
        const index3 = blocks[index2].tasks.indexOf(currentTask[0])
        blocks[index2].tasks.splice(index3, 1)
      }
      setBlocks([...blocks])
      _Storage.set('blocks', JSON.stringify([...blocks]))
      setCurrentTask([])
    }
  }

  return (
    <main className={s.app}>
      <div className={s.header}>
        <div className={s.header__btns}>
          <div onClick={addBlock} className={s.header__btns__btn}>
            Добавить блок
          </div>
        </div>
        <p></p>
      </div>
      <div className={s.container}>
        {blocks.map((el, index)=> {
          return <div onDrop={(e)=>onDrop(e, el.id)}
                      onDragOver={(e)=>onOver(e)}
                      onDragEnd={(e)=>onDragEnd(e)}
                      className={s.container__block}
                      key={index}>
            <div className={s.container__block__header}>
              <input placeholder={'Название блока'}
                     onChange={(e)=>editBlock(e, el.id)}
                     value={el.name}
                     type="text"/>
              <p onClick={() => removeBlock(el.id)}>X</p>
            </div>
            {el.tasks.map((elem, index)=>{
              return <div draggable
                          onDragStart={(e)=>onDragStart(e, elem, el.id)}
                          key={index}
                          onClick={(e)=>openEditTask(e, el.id, elem.id)}
                          className={s.container__block__tasks__task}>
                {elem.edit
                  ? <textarea autoFocus
                              placeholder={'Введите текст'}
                              onChange={(e)=>editTask(e, el.id, elem.id)}
                              value={elem.name} />
                  : <>
                    <div onClick={(e)=>removeTask(e, el.id, elem.id)}>Удалить</div>
                    <p>{elem.name || 'Нажмите, чтобы редактировать карточку'}</p>
                </>
                }
              </div>
            })}
            <div onClick={()=>addTask(el.id)} className={s.container__block__tasks__add}>+</div>
          </div>
        })}
      </div>
    </main>
  );
}

export default App;
