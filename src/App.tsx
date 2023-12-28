import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import './App.css'


export default function App() {
  const firstRender = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);
  const [editTask, setEditTask] = useState({
    enable: false,
    task: ''
  });

  useEffect(() => {
    const tarefasSalvas = localStorage.getItem("cursoReact")
    if (tarefasSalvas) {
      setTasks(JSON.parse(tarefasSalvas));
    }
  }, [])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return
    }
    localStorage.setItem("cursoReact", JSON.stringify(tasks))
  }, [tasks])

  const handleRegister = useCallback(() => {
    if (!input) {
      alert("Preencha o nome da sua tarefa!")
      return;
    }

    if (editTask.enable) {
      handleSaveEdit();
      setInput("")
      return;
    }

    setTasks(tarefas => [...tarefas, input])
    setInput("")
  }, [input, tasks])

  function handleSaveEdit() {
    const findIndexTask = tasks.findIndex(task => task === editTask.task)
    const allTasks = [...tasks];

    allTasks[findIndexTask] = input;
    setTasks(allTasks);
    setEditTask({
      enable: false,
      task: ''
    })
    setInput("")
  }

  function handleDelete(item: string) {
    const removeTask = tasks.filter(task => task !== item)
    setTasks(removeTask)
  }

  function handleEdit(item: string) {
    inputRef.current?.focus();
    setInput(item)
    setEditTask({
      enable: true,
      task: item
    })
  }

  const totalTarefas = useMemo(() => {
    return tasks.length
  }, [tasks])

  return (
    <div>
      <main className='container'>
        <h1 className='title'>Lista de tarefas</h1>

        <input
          placeholder='Digite o nome da tarefa...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='input'
          ref={inputRef} />
        <button onClick={handleRegister} className='button'>
          {editTask.enable ? "Atualizar tarefa" : "Adicionar tarefa"}
        </button>
      </main>

      <main className='container-span'>
        <strong className='strong'>Você tem {totalTarefas} tarefas! 📊</strong>
        {tasks.map((item, index) => (
          <section key={item}>
            <span className='span'> * {item}</span>
            <button onClick={() => handleEdit(item)} className='edit'>Editar</button>
            <button onClick={() => handleDelete(item)} className='delete'>Excluir</button>
          </section>
        ))}

      </main>

    </div>

  )
}

