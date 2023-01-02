let mascota = document.querySelector('#mascota');
let propietario = document.querySelector('#propietario');
let telefono = document.querySelector('#telefono');
let fecha = document.querySelector('#fecha');
let hora = document.querySelector('#hora');
let sintomas = document.querySelector('#sintomas');
let idReserva = 0;
const columnaCitas = document.querySelector('.columna-citas');
let newSet = new Set();

eventManager();
function eventManager() {
    const eventButton = document.querySelector('.btn-success');
    
    eventButton.addEventListener('click', (e) => {
        e.preventDefault();
        let citaEvent = new Dating();
        citaEvent.newDate(mascota.value, propietario.value, telefono.value, fecha.value, hora.value, sintomas.value);
    });
}

//CREATES THE CLASS DATE TO BUILD OBJECTS, and make Datings----------------------------------------------------------------------------------------*
class Dating {
    constructor(mascota, propietario, telefono, fecha, hora, sintomas, idReserva) {
        this.mascota = mascota;
        this.propietario = propietario;
        this.telefono = telefono;
        this.fecha = fecha;
        this.hora = hora;
        this.sintomas = sintomas
        this.idReserva = idReserva;
    }

    newDate (mascota, propietario, telefono, fecha, hora, sintomas) {
        if(isBlank(mascota) || isBlank(propietario) || isBlank(telefono)|| isBlank(telefono) || isBlank(fecha) || isBlank(hora) || isBlank(sintomas)) {
            printResponse("Existen campos vacios", "error");
            return;
        }
        console.log(fecha)
        if(isInThePast(fecha) || fecha.substring(0,4) > 2023) {
            printResponse("Año erroneo", "error");
            return;
        } 
        if(newSet.has(hora + " " + fecha)){
            printResponse("Horario ya reservado", "error");
            return;
        } 
        
        cleanHtml();

        idReserva = ++idReserva;
        let citaNueva = new Dating(mascota, propietario, telefono, fecha, hora, sintomas, idReserva);
        newSet.add(hora + " " + fecha);
        console.log(newSet);
        printResponse("Turno reservado exitosamente", "success");
        print(citaNueva);
        return idReserva; 
    }


    removeDate(fecha, hora) {
        newSet.delete(hora + " " + fecha);
    }


    editDate(mascotaValue, propietarioValue, telefonoValue, fechaValue, horaValue, sintomasValue) {

        mascota.value = mascotaValue;
        propietario.value = propietarioValue;
        telefono.value = telefonoValue;
        fecha.value = fechaValue;
        hora.value = horaValue;
        sintomas.value = sintomasValue;

        this.removeDate(fechaValue, horaValue);
    }

}


//CREATES THE ORDER IN DOM ----------------------------------------------------------------------------------------*
function print(objetoImprimir) {

    //create elements
    const container = document.createElement('div');
    const p = document.createElement('p');
    const buttonEdit = document.createElement('button');
    const buttonDelete = document.createElement('button');

    //defines some atributtes
    buttonEdit.innerText = "Edit";
    buttonDelete.innerText = "Delete";
    buttonEdit.className = "btn btn-primary btn-sm d-inline-block mr-1";
    buttonEdit.setAttribute("onclick", "editObject(this.parentNode); deleteObject(this.parentNode)");
    buttonDelete.className = "btn btn-danger btn-sm d-inline-block ml-1";
    buttonDelete.setAttribute("onclick","deleteObject(this.parentNode)");
    let elemento = `<span><b>${(objetoImprimir.mascota).toUpperCase()}</b></span><br><span><b>Propietario:</b><span> ${objetoImprimir.propietario}</span></span><br><span><b>Telefono:</b><span> ${objetoImprimir.telefono}</span></span><br><span><b>Fecha:</b><span> ${objetoImprimir.fecha}</span></span><br><span><b>Hora:</b><span> ${objetoImprimir.hora}</span></span><br><span><b>Sintomas:</b><span> ${objetoImprimir.sintomas}</span></span><br><span><b>Id reserva:</b><span> ${objetoImprimir.idReserva}</span></span><br>`;
    p.innerHTML = elemento;

    //puts the order in dom
    container.appendChild(p);
    container.appendChild(buttonEdit);
    container.appendChild(buttonDelete);
    columnaCitas.appendChild(container);

}

//PRINTS ERROR/SUCCESS IN DOM ----------------------------------------------------------------------------------------*
function printResponse(codeToPrint, tipeOfPrinting) {
    const contenedor = document.querySelector('#nueva-cita');
    const alert = document.createElement('div');

    if(tipeOfPrinting == "error"){
        if(document.querySelector("#error-alert")) {
            return;
        } else{
                cleanHtml();

                alert.className = "alert alert-danger w-100 text-center";
                alert.id = "error-alert";
                alert.innerText = codeToPrint;

                contenedor.appendChild(alert);
                //Timer to erase the alert
                setTimeout( ()=> {
                    document.querySelector("#error-alert").remove();
                 },2000);
        }
    } else {
            if(document.querySelector("#success-alert")){
                return;
            } else {

                    cleanHtml();
                    
                    alert.className = "alert alert-success w-100 text-center";
                    alert.id = "success-alert";
                    alert.innerText = codeToPrint;

                    contenedor.appendChild(alert);
                    //Timer to erase the alert
                    setTimeout( ()=> {
                        document.querySelector("#success-alert").remove();
                    },2000);
            }
            document.querySelector('#nueva-cita').reset();
    }
}

//CLEAN THE HTML
function cleanHtml() {
    if(document.querySelector("#error-alert")) {
        document.querySelector("#error-alert").remove();
    }
    if(document.querySelector("#success-alert")) {
        document.querySelector("#success-alert").remove();
    }
}

//ERASE ORDER IN DOM AND SENDS TO DELETE IN SET ----------------------------------------------------------------------------------------*
function deleteObject(object){

    //Creating variables to search the object in set
    let fecha = object.children[0].children[6].children[1].innerText;
    let hora = object.children[0].children[8].children[1].innerText;

    //Sending object to delete in Set
    let dateDelete = new Dating();
    dateDelete.removeDate(fecha, hora);

    //Removing object in DOM
    return object.remove()
}

//CLEARS THE OBJECT AND SENDS THE INFO TO EDIT A NEW ORDER ----------------------------------------------------------------------------------------*
function editObject(object) {
    //creating variables
    let mascota = object.children[0].children[0].innerText;
    let propietario = object.children[0].children[2].children[1].innerText;
    let telefono = object.children[0].children[4].children[1].innerText;
    let fecha = (object.children[0].children[6].children[1].innerText).replace(/\s/g, '');
    let hora = (object.children[0].children[8].children[1].innerText).replace(/\s/g, '');
    let sintomas = object.children[0].children[10].children[1].innerText;
    let idReserva = object.children[0].children[12].children[1].innerText;

    //Sending to edit object
    let objectEdited = new Dating();
    objectEdited.editDate(mascota, propietario, telefono, fecha, hora, sintomas, idReserva);
}


//CHECKS THE DATE TO VALIDATE IF IS A PAST TIME ----------------------------------------------------------------------------------------*
function isInThePast(dateReceived) {
    const newDate = new Date();
    let actualDate = newDate.toLocaleDateString();

    actualDate = moment(actualDate, "DD-MM-YYYY")
    dateToVerif = moment(dateReceived, "YYYY-MM-DD");

    let dif = actualDate.diff(dateToVerif);
    if (dif < 0) {
        console.log('Date is not past');
        return false;
    }else{
        console.log('Date is past');
        return true;
    }
}


//VALIDATES IF FIELDS ARE EMPTY OR BLANK ----------------------------------------------------------------------------------------*
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}




