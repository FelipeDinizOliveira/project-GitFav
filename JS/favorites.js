import { GithubUser } from "../githubUser.js"

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.entries = [];
    this.load(); // Carrega os favoritos do localStorage
  }
  

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
    console.log(this.entries);
  }
  

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username)

      if (userExists) {
        throw new Error('Usuário já cadastrado')
      }


      const user = await GithubUser.search(username)

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch (error) {
      alert(error.message)
    }
  }
  delete(user) {

    const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login)
    console.log(filteredEntries)

    this.entries = filteredEntries
    this.update()
    this.save()

  }


}

export class FavoritesView extends Favorites {

  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('table tbody')
    this.update()
    this.onadd()

  }


  onadd() {
    const addButton = this.root.querySelector('.SearchField button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector(`.SearchField input`)

      this.add(value)
    }
  }




  update() {
    this.removeAllTr()


    this.entries.forEach(user => {
      console.log(user)

      const row = this.createRow()
      console.log(row)
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = ` imagem de ${user.name}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user a').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.seguidores').textContent = user.followers
      row.querySelector('.delete').onclick = () => {
        const isOK = confirm(`Deseja remover o ${user.name} da sua lista de favoritos?`)

        if (isOK) {
          this.delete(user)
        }

      }



      this.tbody.append(row)
    })

  }

  createRow() {
    const tr = document.createElement('tr')



    tr.innerHTML = `
 
  <td class ="user">
   <div class="Inf-username"> <img src="https://github.com/FelipeDinizOliveira.png" alt=" imagem de Felipe Diniz">
      <div id="UserWrapper">
          <p> Felipe </p>

          <a href=" https://github.com/FelipeDinizOliveira"> @FelipeDinizOliveira</a>
      </div>
   </div>
  </td>


<td class ="repositories"> 76 </td>
<td class ="seguidores"> 140 </td>
<td> <button class ="delete"> remover </button> </td>


`
    return tr

  }

  removeAllTr() {

    this.tbody.querySelectorAll('tr')
      .forEach(tr => {
        tr.remove()
      })

  }



}




