const addBtn= document.getElementById('add-btn'),
form= document.getElementById('form-catatan'),
tutupForm= document.getElementById('tutup-form'),
judul= document.getElementById('judul-input'),
tanggal= document.getElementById('tanggal-input'),
deskripsi= document.getElementById('deskripsi-input'),
tambahCatatan= document.getElementById('btn-tambah');
let contentEl= document.querySelector('.content-container');

let simpleMde;
document.addEventListener('DOMContentLoaded', ()=> {
    simpleMde= new SimpleMDE({ el: deskripsi });
    displayData();
})
let data= JSON.parse(localStorage.getItem('Catatan-Agro')) || [];
let catatanEdit= {};

function tambahData(){
    const deskripsiMarkdown= simpleMde.value();

    if(!judul.value.trim() || !deskripsiMarkdown.trim()|| !tanggal.value){
        alert('Silahkan isi judul tanggal juga deskripsi!');
        return;
    }
    const cekIdx= data.findIndex(item=> item.id=== catatanEdit.id);
    const dataObj={
        id: `${judul.value.toLowerCase().split(' ').join('')}-${Date.now()}`,
        judul: judul.value,
        tanggal: tanggal.value,
        deskripsi: deskripsiMarkdown
    }
    if(cekIdx === -1){
        data.unshift(dataObj)
    }else{
        data[cekIdx]= dataObj
    }
    localStorage.setItem('Catatan-Agro', JSON.stringify(data));
    displayData();
    reset();
    return data;
}

function displayData(){
    const storedData = JSON.parse(localStorage.getItem('Catatan-Agro')) || [];
    contentEl.innerHTML= '';
    storedData.forEach(
        ({ id, judul, tanggal, deskripsi})=> {
             contentEl.innerHTML+= `
             <div class="catatan" id="${id}" data-id="${id}">
                <p><strong>Judul:</strong> ${judul}</p>
                <p><strong>Tanggal:</strong> ${tanggal}</p>
                <p><strong>Deskripsi:</strong> ${marked.parse(deskripsi)}</p>
                <button type="button" class="edit-btn">EDIT</button>
                <button type="button" class="delete-btn">DELETE</button>
                <div class="divider"></div>
             </div>
             `
        }
    )
}

function deleteData(e){
    const catatanEl= e.target.closest('.catatan');
    let hapus= confirm('Yakin catatan ini dihapus?');
    if(!hapus) return;
    if(catatanEl) {
        const id= catatanEl.dataset.id;
        const cekId= data.findIndex(item=> item.id=== id);
        data.splice(cekId, 1);
        catatanEl.remove();
        localStorage.setItem('Catatan-Agro', JSON.stringify(data));
        displayData();
    }else {
        return;
    }
}
function editData(e){
    const catatanEl= e.target.closest('.catatan');
    if(catatanEl){
        const id= catatanEl.dataset.id;
        const storedData = JSON.parse(localStorage.getItem('Catatan-Agro')) || [];
        const cekId= storedData.findIndex(item=> item.id=== id);
        catatanEdit= storedData[cekId];
        judul.value= catatanEdit.judul;
        tanggal.value= catatanEdit.tanggal;
        simpleMde.value(catatanEdit.deskripsi);
        form.classList.add('show');
        tambahCatatan.textContent= 'EDIT CATATAN';
        displayData();
    }else {
        return;
    }
}

function reset(){
    form.classList.remove('show');
    judul.value= '';
    tanggal.value= '';
    simpleMde.value('');
    tambahCatatan.textContent= 'TAMBAH CATATAN';
}

if(data.length){
    displayData();
}

contentEl.addEventListener('click', (e)=> {
    const deleteBtn= e.target.closest('.delete-btn');
    const editBtn= e.target.closest('.edit-btn');
    if(deleteBtn) {
        deleteData(e);
    };
    if(editBtn){
        editData(e);
    }
})

addBtn.addEventListener('click', ()=>{
    form.classList.add('show');
})
tambahCatatan.addEventListener('click', ()=>{
    tambahData();
})

tutupForm.addEventListener('click', ()=>{
    form.classList.remove('show');
})

//SAVE DATA FROM LOCAL STORAGE
const exportBtn= document.getElementById('exportBtn');
const importBtn= document.getElementById('importBtn');
const fileInput= document.getElementById('fileInput');
const deleteBtn= document.getElementById('deleteBtn');

//EXPORT DATA
exportBtn.addEventListener('click', ()=>{
    const data= {};
    const keys= ['Catatan-Agro'];
    keys.forEach(key=> {
        const value= localStorage.getItem(key);
        if(value){
            data[key]= value;
        }
    })
    if (Object.keys(data).length === 0) {
        alert("Tidak ada data yang bisa diekspor.");
        return;
    }
    const blob= new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
    })
    const link= document.createElement('a');
    link.href= URL.createObjectURL(blob);
    link.download= 'catatanAgro.json';
    link.addEventListener('click', ()=> {
        setTimeout(()=> alert('Transfer Berhasil..!'), 100);
    })
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
})

importBtn.addEventListener('click', ()=> {
    if(fileInput.files.length=== 0){
        alert('Silahkan pilih file.');
        return;
    }
    const file= fileInput.files[0];
    const reader= new FileReader();
    reader.onload= (e)=> {
        try {
           const data= JSON.parse(e.target.result);
           Object.keys(data).forEach(key=> {
              localStorage.setItem(key, data[key]);
           })
           alert('Import Berhasil..!')
           displayData();
        }catch(err) {
            alert(`Oops, Gagal import! ${err.message}`);
        }
    }
    reader.readAsText(file);
    displayData();
})

deleteBtn.addEventListener('click', ()=> {
    let konfirmasi= confirm('Peringatan! seluruh data localStorage akan dihapus?')
    if(konfirmasi){
        localStorage.clear();
        displayData();
    }else{
        return;
    }
});




