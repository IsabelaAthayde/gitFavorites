import { GitHubUsers } from "./GitHubUsers.js";

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root);
        this.tbody = this.root.querySelector('table tbody');

        this.load()
    }
    
    load() {
        this.entries = JSON.parse(
            localStorage.getItem('@github-favorites:')) || []
            
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }
        
    async add(username) {
        try  {
            const userExists = this.entries.find(entry => entry.login === username);
    
            if(userExists) {
                throw new Error("Usuário já cadastrado!")
            }

            const user = await GitHubUsers.search(username)

            if(user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries];
            this.update()
            this.save()

        } catch(error) {
            alert(error.message)
        }
    }
        
    delete(user) {
        const filteredEntries = this.entries
        .filter(entry => entry.login !== user.login) 
        
        this.entries = filteredEntries;
        this.update()
        this.save()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root);

        this.update()
        this.addRow()
    }

    addRow() {
        const addButton = this.root.querySelector('.search button');
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input');
            console.log(value) 
            this.add(value)
        }
        
    }

    update() { 
        this.removeAllTr()
        this.entries.forEach(user => {
            const row = this.createTr()

            row.querySelector(".user img").src = `https://github.com/${user.login}.png`;
            row.querySelector(".user img").alt = `Imagem de ${user.name}`;
            row.querySelector(".user a").href = `https://github.com/${user.login}`;
            row.querySelector(".user p").textContent = `${user.name}`;
            row.querySelector(".user span").textContent = `${user.login}`;  
            row.querySelector(".repositories").textContent = `${user.public_repos}`;
            row.querySelector(".followers").textContent = `${user.followers}`;
            
            this.tbody.append(row)

            row.querySelector("td button").addEventListener("click", () => {
                const isOk = confirm("Tem certeza que quer deletar?");
                if (isOk) {

                this.delete(user)
                }
            })
        })
       
    }



    createTr() {
        const tr = document.createElement('tr');

        tr.innerHTML = `
        <td class="user">
          <img src="https://github.com/IsabelaAthayde.png" alt="Imagem de Isabela Athayde">
          <a href="https://github.com/IsabelaAthayde">
            <p>Isabela Athayde</p>
            <span>IsabelaAthayde</span>
          </a>
        </td>
        <td class="repositories">123</td>
        <td class="followers">1234</td>
        <td><button>Remover</button></td>
        `;
        return tr;
    }

    removeAllTr() {
       
       this.tbody.querySelectorAll("tr").forEach((tr) => {
        tr.remove()
       });
    }
    
}