let studentDB; // undefined
let coursesDB;
let nameOrder = 'asc';

function addAllEventListeners() {
    const addUserForm = document.getElementById("add-user-form");
    const assignCourseToStudent = document.getElementById("course-user-form");
    const searchStudentForm = document.getElementById("search-student");
    const cleanSearchBtn = document.getElementById("clean-search");
    const orderByName = document.getElementById("order-by-name");

    addUserForm.addEventListener("submit", addStudent);
    assignCourseToStudent.addEventListener("submit", addCourseToStudent);
    searchStudentForm.addEventListener("submit", searchStudent);
    cleanSearchBtn.addEventListener("click", cleanSearch);
    orderByName.addEventListener("click", orderStudentsByName);
}

function checkStudentLocalStorage() {
    const studentDBLocalStorage = localStorage.getItem('students');
    
    if(!studentDBLocalStorage) 
        localStorage.setItem('students', JSON.stringify([]))

    studentDB = JSON.parse(localStorage.getItem('students')) 

    console.log(studentDB)
}

async function checkCoursesLocalStorage() {
    try {
        const response = await fetch('../mockData/materias.json');
        const courses = await response.json();

        const coursesDBLocalStorage = localStorage.getItem('courses');
    
        if(!coursesDBLocalStorage) 
            localStorage.setItem('courses', JSON.stringify(courses))

        coursesDB = courses;
        console.log(coursesDB)
    } catch(err) {
        console.error(err)
    }
}

function updateStudentTable(students) {
    const tableRef = document.getElementById("studentTable");
    tableRef.innerHTML = '';

    students?.forEach(student => {
        const newRow = tableRef.insertRow();
        const keys = Object.keys(student);

        keys.forEach((atribute, idx) => {
            const cell = newRow.insertCell(idx);
            const text = document.createTextNode(student[atribute] || 'N/A');
            cell.appendChild(text);
        })
    })

}

function loadStudentCourseSelectOptions () {
    const studentSelect = document.getElementById('students');
    const coursesSelect = document.getElementById('courses');

    // clean children
    studentSelect.innerHTML = '';
    coursesSelect.innerHTML = '';
    
    const createSelectOption = item => {
        const option = document.createElement('option');
        option.text = item.name;
        option.value = item.id;

        return option; // HTMLElement -> <option />
    };

    const studentOptions = studentDB.map(createSelectOption);
    const courseOptions = coursesDB.map(createSelectOption);

    studentOptions.forEach(option => studentSelect.appendChild(option));
    courseOptions.forEach(option => coursesSelect.appendChild(option));
}

function addStudent(e) {
    e.preventDefault();

    const id = studentDB.length+1;
    const name = document.querySelector("#add-user-form input[id='name']")?.value;
    const lastName = document.querySelector("#add-user-form input[id='lastName']")?.value;
    const age = document.querySelector("#add-user-form input[id='age']")?.value;
    
    studentDB.push({
        id,
        name,
        lastName,
        age,
        course: '',
        rating: ''
    });

    localStorage.setItem('students', JSON.stringify(studentDB))
    alert('Usuario guardado exitosamente');

    updateStudentTable(studentDB);
}

function addCourseToStudent(e){
    e.preventDefault();

    const studentId = parseInt(document.querySelector('#students')?.value);
    const courseId = parseInt(document.querySelector('#courses')?.value);

    const student = studentDB.find(student => student.id === studentId);
    const course = coursesDB.find(course => course.id === courseId);
    student.course = course.name;

    localStorage.setItem('students', JSON.stringify(studentDB));
    updateStudentTable(studentDB);
    
    alert('Materia asignada exitosamente');
}

function searchStudent(e){
    e.preventDefault();
    const searchString = document.getElementById('search-value')?.value?.toLowerCase();

    const studentsFiltered = studentDB.filter(student => student.name.toLowerCase().includes(searchString))  
    updateStudentTable(studentsFiltered);
}

function orderStudentsByName(e){
    e.preventDefault();

    const studentOrdered = studentDB.sort((student1, student2) => {
        const name1 = student1.name.toLowerCase();
        const name2 = student2.name.toLowerCase();

        if(nameOrder === 'asc'){
            return (name1 < name2) ? -1 : (name1 > name2) ? 1 : 0;
        }

        if(nameOrder === 'desc') {
            return (name1 > name2) ? -1 : (name1 < name2) ? 1 : 0;
        }
    });
    
    const nameHeader = document.getElementById("order-by-name");
    nameHeader.innerHTML = '';

    if(nameOrder === 'asc'){
        nameOrder = 'desc';
        nameHeader.text = 'Nombre (asc)'
        const text = document.createTextNode('Nombre (desc)');
        nameHeader.appendChild(text);
    } else {
        nameOrder = 'asc';
        const text = document.createTextNode('Nombre (asc)');
        nameHeader.appendChild(text);
    }

    updateStudentTable(studentOrdered);
}

function cleanSearch(e) {
    e.preventDefault();
    
    const searchString = document.getElementById('search-value');
    searchString.value = '';
    
    updateStudentTable(studentDB);
}

async function loadInitialPage() {
    try {
        addAllEventListeners();
        checkStudentLocalStorage();
        await checkCoursesLocalStorage();
        updateStudentTable(studentDB);
        loadStudentCourseSelectOptions();
    } catch(e) {
        console.error(e)
    }
}

loadInitialPage();