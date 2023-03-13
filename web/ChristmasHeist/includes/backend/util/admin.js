const _0xae049="Canakkale";
const _0x2ab79="Vn3TyV";


const submit = document.querySelector('button')
const inp = document.querySelector('input')

cities = ["Adana","Adiyaman","Afyon","Agri","Aksaray","Amasya","Ankara","Antalya","Ardahan","Artvin","Aydin","Balikesir","Bartin","Batman","Bayburt","Bilecik","Bingol","Bitlis","Bolu","Burdur","Bursa","Canakkale","Cankiri","Corum","Denizli","Diyarbakir","Duzce","Edirne","Elazig","Erzincan","Erzurum","Eskisehir","Gaziantep","Giresun","Gumushane","Hakkari","Hatay","Igdir","Isparta","Istanbul","Izmir","Kahramanmaras","Karabuk","Karaman","Kars","Kastamonu","Kayseri","Kilis","Kirikkale","Kirklareli","Kirsehir","Kocaeli","Konya","Kutahya","Malatya","Manisa","Mardin","Mersin","Mugla","Mus","Nevsehir","Nigde","Ordu","Osmaniye","Rize","Sakarya","Samsun","Sanliurfa","Siirt","Sinop","Sirnak","Sivas","Tekirdag","Tokat","Trabzon","Tunceli","Usak","Van","Yalova","Yozgat","Zonguldak"];
const _0x3451ac="6B6Qy8G";
const _0x0ba4e="gIMSB2z";

function aisdhfadhjs(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

submit.addEventListener('click', (e) => {
    if(akdslfhjaksdfhj(inp.value)) {
        document.querySelector('p').innerHTML = "Check "+"/"+_0x2ab79+_0x3451ac+_0x0ba4e;
    }
})

function akdslfhjaksdfhj(city){
    return city.toLowerCase() == _0xae049.toLowerCase()
}

