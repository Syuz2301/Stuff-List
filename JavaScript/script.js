class User {
    constructor(firstName, lastName, position, salary, userId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.position = position;
        this.salary = salary;
        this.userId = userId;
    }
}
class Store {
    static getUsers() {
        let users;
        if(localStorage.getItem('users') === null) {
            users = []
        }else {
            users = JSON.parse(localStorage.getItem('users'))
        }
        return users

    }
    static addUser(user) {
        const users = Store.getUsers();
        users.push(user);
        localStorage.setItem('users',JSON.stringify(users))
    }
    static  removeUser(userId) {
        const users = Store.getUsers();
        users.forEach((user, index) => {
            if(user.userId == userId){
                users.splice(index, 1)
            }
        });
        localStorage.setItem('users', JSON.stringify(users));
    }
}

let totalSalary = 0;
class UI {
    static displayUsers() {
        let arr = [];
        const users = Store.getUsers();
        users.forEach((user)=> UI.addUserToStuff(user));
    }
    static addUserToStuff(user) {
        const list = document.querySelector('#user-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.position}</td>
            <td>${user.salary}</td>
            <td>${user.userId}</td>
            <td>
                <a href="#" data-type="edit" class="btn btn-success btn-sm delete">&#9998;</a>
                <a href="#" data-type="delete" class="btn btn-danger btn-sm delete">X</a>
            </td>     
        `;
        list.appendChild(row);
        totalSalary += +user.salary;
        document.querySelector('#amountSalary').innerText = totalSalary;
        document.querySelector('#countWorkers').innerHTML = document.querySelector('#user-list').childNodes.length
    }
    static clearUserInputValue() {
        document.querySelector('#firstName').value = '';
        document.querySelector('#lastName').value = '';
        document.querySelector('#position').value = '';
        document.querySelector('#salary').value = ''
    }
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.innerHTML = message;
        document.querySelector('#alert-container').append(div);
        setTimeout(()=>{
            document.querySelector('.alert').remove();
        },2000)
    }
    static deleteUser(value){
        let salary = value.parentElement.parentElement.children[3];
        value.parentElement.parentElement.remove();
        totalSalary -= salary.innerText;
        document.querySelector('#amountSalary').innerText = totalSalary;
        document.querySelector('#countWorkers').innerHTML = document.querySelector('#user-list').childNodes.length
    }   
}
// event 
const generateRandomId = () => Date.now().toString().slice(-5);
document.addEventListener('DOMContentLoaded', () => {
    UI.displayUsers()
});

document.querySelector('#user-form').addEventListener('submit', e => {
    e.preventDefault();
    const firstName = document.querySelector('#firstName').value;
    const lastName = document.querySelector('#lastName').value;
    const position = document.querySelector('#position').value;
    const salary = document.querySelector('#salary').value;
    document.querySelector('#submit').value = 'Add User';
    if (firstName && lastName && position && salary) {
        const user = new User(firstName, lastName, position, salary, generateRandomId()); 
        UI.addUserToStuff(user);
        UI.clearUserInputValue();
        UI.showAlert('Added User', 'success');
        Store.addUser(user); 
        document.querySelector('#id01').style.display='none';
    }else {
        UI.showAlert('Empty input', 'danger')
    }
  
});
document.querySelector('#user-list').addEventListener('click', e => {
    const userId = e.target.parentElement.previousElementSibling.innerHTML;
    if (e.target.closest('[data-type="delete"]')){
        Store.removeUser(userId);
        UI.deleteUser(e.target)
    }
    else if (e.target.closest('[data-type="edit"]')){
        const td = e.target.parentElement.parentElement.children;
        displayModal();
        document.querySelector('#firstName').value = td[0].innerHTML;
        document.querySelector('#lastName').value = td[1].innerHTML;
        document.querySelector('#position').value = td[2].innerHTML;
        document.querySelector('#salary').value = td[3].innerHTML;
        document.querySelector('#submit').value = 'Edit User';
        document.querySelector('#user-form').addEventListener('submit', m => {
        m.preventDefault();
        UI.deleteUser(e.target);
        Store.removeUser(userId);
});
    }
   
});
//Modal part
function displayModal(){
    document.querySelector('#id01').style.display='block';
    document.querySelector('.close').addEventListener('click',() =>{
        document.querySelector('#id01').style.display='none';
    })
}
