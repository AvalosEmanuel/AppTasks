
//Conectamos el archivo js con el contrato sol..
const TasksContract = artifacts.require("TasksContract")

//Pasamos el nombre de la constante que creamos arriba..
contract("TasksContract", () => {

    //Ejecutamos el deploy del contrato..
    before(async () => {
        this.tasksContract = await TasksContract.deployed()
    })

    //Descripción del test..
    //Deploy correcto..
    it('migrate deployed successfully', async () => {
        const address = this.tasksContract.address //address del contrato deployed..

        //Verificamos que la const no este undefined, null, 0x0, "".. 
        //Lo cual nos indica que el deploy fue correcto..
        assert.notEqual(address, undefined);
        assert.notEqual(address, null);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
    })

    //Obtener tarea de la lista..
    it('get tasks list', async () => {
        const tasksCounter = await this.tasksContract.taskCounter() //Obtenemos el valor del contador de tareas..
        const task = await this.tasksContract.tasks(tasksCounter) //Obtenemos la tarea en la posición del contador de tareas..

        //Comparamos informacíon de la tarea. Id, title, description, done y valor del contador..
        assert.equal(task.id.toNumber(), tasksCounter) 
        assert.equal(task.title, "Primer tarea de ejemplo") 
        assert.equal(task.description, "Tengo que hacer algo")
        assert.equal(task.done, false)
        assert.equal(tasksCounter, 1)
    })

    //Tarea creada de forma correcta..
    it('task created successfully', async () => {
        const result = await this.tasksContract.createTask("some task", "description two") //Creamos una tarea..
        const taskEvent = result.logs[0].args //Accedemos al evento lanzado por la creacion de la tarea..
        const taskCounter = await this.tasksContract.taskCounter() //Almacenamos el valor del contador..

        //Verificamos que el contador se actualice y los valores obtenidos por el evento lanzado..
        //contador actualizado, id, title, description, done..
        assert.equal(taskCounter, 2)
        assert.equal(taskEvent.id.toNumber(), 2)
        assert.equal(taskEvent.title, "some task")
        assert.equal(taskEvent.description, "description two")
        assert.equal(taskEvent.done, false)
    })

    //Tarea actualizada de forma correcta..
    it('task toggle done', async () => {
        const result = await this.tasksContract.toggleDone(1)//Almacenamos el evento lanzado por la función..
        const taskEvent = result.logs[0].args //Accedemos a los datos que nos interesan del evento..
        const task = await this.tasksContract.tasks(1) //Almacenamos la tarea del mapping en el indice correspondiente..

        //Verificamos que la tarea haya sido actualizada..
        //Comparamos el id para asegurarnos de testear la tarea correcta..
        assert.equal(task.done, true)
        assert.equal(taskEvent.done, true)
        assert.equal(taskEvent.id, 1)
    })
});