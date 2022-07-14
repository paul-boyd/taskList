window.addEventListener('load', () => {
    toDos = JSON.parse(localStorage.getItem('toDos')) || []
    const newForm = document.querySelector('#newForm')

    newForm.addEventListener('submit', e => {
        e.preventDefault ()
        
        const toDo = {
            content: e.target.elements.content.value,
            date: e.target.elements.dueDate.value,
            time: e.target.elements.dueTime.value,
            done: false,
        }

        toDos.push(toDo)

        localStorage.setItem('toDos', JSON.stringify(toDos))

        e.target.reset()

        displayToDos()

        createScreen.style.display = 'none'
        if (window.innerWidth > 480){
            createButtonBig.style.display = 'flex'
        } else {
            createButton.style.display = 'flex'
        }
    })

    displayToDos()

    const clearButton = document.querySelector('.clear')
    clearButton.addEventListener('click', () => {
        result = confirm('This will clear all tasks! Do you want to continue?')
        if (result) {
            localStorage.removeItem('toDos')
            window.location.reload()
        }else{
            preventDefault ()
        }
    })

    const sortButton = document.querySelector('.sort')
    sortButton.addEventListener('click', () => {

        toDos.sort(taskSortFunction)
            
        function taskSortFunction (a, b) {
            let aDate = new Date(a.date).getTime()
            let bDate = new Date(b.date).getTime()
            let aTime = a.time
            let bTime = b.time

            if (aDate === bDate){
                if(aTime > bTime){
                    return 1
                } else {
                    return -1
                }
            } else {
                return (aDate = aDate || 0) - (bDate = bDate || 0)
            }
        }

        localStorage.setItem('toDos', JSON.stringify(toDos))
        displayToDos()
    })

    const createButton = document.querySelector('.create')
    const createButtonBig = document.querySelector('.createBigger')
    const createScreen = document.querySelector('.createToDo')
    const createScreenText = document.querySelector('#content')

    createButton.addEventListener('click', function () {
        window.scrollTo(0, 0)
        createScreen.style.display = 'flex'
        createButton.style.display = 'none'
        createScreenText.focus()
    })

    createButtonBig.addEventListener('click', function () {
        window.scrollTo(0, 0)
        createScreen.style.display = 'flex'
        createButtonBig.style.display = 'none'
        createScreenText.focus()
    })

    const closeButton = document.querySelector('.close')
    closeButton.addEventListener('click', function () {
        createScreen.style.display = 'none'
        if (window.innerWidth > 480){
            createButtonBig.style.display = 'flex'
        } else {
            createButton.style.display = 'flex'
        }
    })

})

function displayToDos () {
    const list = document.querySelector('#list')
    list.innerHTML = ''

    toDos.forEach(toDo => {
        
        const task = document.createElement('div')
        task.classList.add('task')
        task.setAttribute('draggable', true)

        const label = document.createElement('label')
        const input = document.createElement('input')
        const span = document.createElement('span')
        const content = document.createElement('div')
        const actions = document.createElement('div')
        const scroll = document.createElement('button')
        const edit = document.createElement('button')
        const remove = document.createElement('button')


        input.type = 'checkbox'
        input.checked = toDo.done
        span.classList.add('bubble')        
        content.classList.add('taskContent')
        actions.classList.add('taskActions')
        scroll.classList.add('scroll')
        edit.classList.add('edit')
        remove.classList.add('remove')

        content.innerHTML = `
            <textarea class="contentText" maxlength="150" rows="1" readonly oninput="autoHeight(event, '2rem')">${toDo.content}</textarea>
            <div class="datesContainer">
                <input type="date" class="contentDate" value="${toDo.date}" readonly>
                <input type="time" class="contentTime" value="${toDo.time}" readonly>
            </div>`

        scroll.innerHTML = '<ion-icon name="code-outline"></ion-icon>'
        edit.innerHTML = '<ion-icon name="create-outline"></ion-icon>'
        remove.innerHTML = '<ion-icon name="close-outline"></ion-icon>'
        
        label.appendChild(input)
        label.appendChild(span)
        actions.appendChild(scroll)
        actions.appendChild(edit)
        actions.appendChild(remove)
        task.appendChild(label)
        task.appendChild(content)
        task.appendChild(actions)
        list.appendChild(task)


        if (toDo.done) {
            task.classList.add('done')
        }

        input.addEventListener('click', e => {
            toDo.done = e.target.checked
            localStorage.setItem('toDos', JSON.stringify(toDos))

            if (toDo.done) {
                task.classList.add('done')
            } else {
                task.classList.remove('done')
            }

            displayToDos ()
        })


        edit.addEventListener('click', e => {
            const input = content.querySelector('.contentText')
            const inputDate = content.querySelector('.contentDate')
            const inputTime = content.querySelector('.contentTime')
            input.removeAttribute('readonly')
            inputDate.removeAttribute('readonly')
            inputTime.removeAttribute('readonly')
            input.focus()
            edit.innerHTML = '<ion-icon name="save-outline"></ion-icon>'
            console.log(draggableTasks)
            edit.addEventListener('click', e => {
                input.setAttribute('readonly', true)
                inputDate.setAttribute('readonly', true)
                inputTime.setAttribute('readonly', true)
                toDo.content = input.value
                toDo.date = inputDate.value
                toDo.time = inputTime.value
                localStorage.setItem('toDos', JSON.stringify(toDos))
                displayToDos ()
                edit.innerHTML = '<ion-icon name="create-outline"></ion-icon>'
            })            
        })
        
        remove.addEventListener('click', e => {
            toDos = toDos.filter(t => t != toDo)
            localStorage.setItem('toDos', JSON.stringify(toDos))
            displayToDos ()
        })

        
        const contentText = content.querySelector('.contentText')
        let newHeight = contentText.scrollHeight
        contentText.style.height = newHeight + "px"
    })

    const draggableTasks =  document.querySelectorAll('.task')
    draggableTasks.forEach(draggable => {
        
        const scrollButton = draggable.querySelector('.scroll')

        function dragStartFunction () {
            draggable.classList.add('dragging')
        }

        function dragEndFunction () {
            draggable.classList.remove('dragging')
            const taskDivs = Array.prototype.slice.call(list.children)
            let newToDosList = []
            taskDivs.forEach(createObject)
            function createObject (element) {
                const newToDo = {
                    content: element.querySelector('.contentText').value,
                    date: element.querySelector('.contentDate').value,
                    time: element.querySelector('.contentTime').value,
                    done: element.classList.contains('done'),
                }
                newToDosList.push(newToDo)
            }
            toDos = newToDosList
            localStorage.setItem('toDos', JSON.stringify(toDos))
            displayToDos ()
        }

        draggable.addEventListener('dragstart', dragStartFunction)
        scrollButton.addEventListener('touchstart', dragStartFunction)

        draggable.addEventListener('dragend', dragEndFunction)
        scrollButton.addEventListener('touchend', dragEndFunction)

    })

    list.addEventListener('dragover', e => {
        e.preventDefault()
        const position = dragPosition(list, e.clientY)
        const activeDrag = document.querySelector('.dragging')
        console.log(activeDrag)
        if (position == null){
            list.appendChild(activeDrag)
        } else {
            list.insertBefore(activeDrag, position)
        }
    })

    list.addEventListener('touchmove', (e) => {
        e.preventDefault()
        const position = dragPosition(list, e.touches[0].clientY)
        const activeDrag = document.querySelector('.dragging')
        console.log(activeDrag)
        if (activeDrag !== null) {
            if (position == null){
                list.appendChild(activeDrag)
            } else {
                list.insertBefore(activeDrag, position)
            }}
    })

    function dragPosition(list, y) {
        const dragItems = [...list.querySelectorAll('.task:not(.dragging)')]
        
        return dragItems.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = y - box.top - box.height /2

            if (offset < 0 && offset > closest.offset) {
                return {offset: offset, element: child}
            } else {
                return closest
            }
        }, {offset: Number.NEGATIVE_INFINITY}).element
    }

}

function autoHeight (element, defaultHeight) {
    if (element) {
        const target = element.target
        let updatedHeight = `${target.scrollHeight}px`
        target.style.height = defaultHeight;
        target.style.height = updatedHeight;}
}