
const searchweath=document.querySelector("[data-searchweather]");
const userweath=document.querySelector("[data-yourweather]");

const weathercontain=document.querySelector(".weather-container");
const grantlocation=document.querySelector(".grant-container");

const searchform=document.querySelector("[data-searchform]");
const loadingscreen=document.querySelector(".loading-container");

const usercontain=document.querySelector(".user-container");


let currenttab=userweath;
const apikey='2ce8b1f2a0725b24e46cf650b8fcac5e';
currenttab.classList.add("current-style");

getSessionStorage();
//tab switching function

function switchTab(clicktab){
	if(clicktab!=currenttab){
		currenttab.classList.remove("current-style");
		currenttab=clicktab;
		currenttab.classList.add("current-style");

		//to make search form visible
		if(!searchform.classList.contains("active")){
			grantlocation.classList.remove("active");
			usercontain.classList.remove("active");
			searchform.classList.add("active");
		}
		else{
			//to make your weather tab visible 
			searchform.classList.remove("active");
			usercontain.classList.remove("active");
			getSessionStorage();
		}

	}
}


userweath.addEventListener('click',()=>{
	//pass clicked tab
	switchTab(userweath);
});

searchweath.addEventListener('click',()=>{
	//pass clicked tab
	switchTab(searchweath);
});

//check if coordinates are already present in session storage
function getSessionStorage(){
	const localCoordinates=sessionStorage.getItem("user-coordinates");
	if(!localCoordinates){
		grantlocation.classList.add("active");
	}else{
		const coordinates=JSON.parse(localCoordinates);
		fetchweatherCoordinates(coordinates);
	}
}

//api call
async function fetchweatherCoordinates(coordinates){
	const {lat,lon}=coordinates;
	grantlocation.classList.remove("active");
	loadingscreen.classList.add("active");

	//api call

	try{
		const res=await fetch('https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid='+apikey);
		const result=await res.json();

		loadingscreen.classList.remove("active");

		usercontain.classList.add("active");
		renderinfo(result);

	
	}catch(err){
		loadingscreen.classList.remove("active");
	}

}




function renderinfo(result){

	const cityname=document.querySelector("[data-cityname]");
	const countryicon=document.querySelector("[data-countricon]");
	const weatherdesc=document.querySelector("[data-weatherdesc]");
	const weathericon=document.querySelector("[data-weathericon]");
	const datatemp=document.querySelector("[data-temp]");

	const wind=document.querySelector("[data-windspeed]");
	const humidity=document.querySelector("[data-humidity]");
	const cloud=document.querySelector("[data-cloud]");

	//optional chaining operator

	cityname.innerText=result?.name;
	countryicon.src='https://flagcdn.com/144x108/'+result?.sys?.country.toLowerCase()+'.png';
	weatherdesc.innerText=result?.weather?.[0]?.description;
	weathericon.src='https://openweathermap.org/img/wn/'+result?.weather?.[0]?.icon+'@2x.png';
	datatemp.innerText=`${result?.main?.temp} °C`;

	wind.innerText=`${result?.wind?.speed} m/s`;
	humidity.innerText=`${result?.main?.humidity}%`;
	cloud.innerText=`${result?.clouds?.all}%`;




}


function getLoaction(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(showPosition);
	}else{
		alert("Geolocation is not supported by this browser")
	}
}


function showPosition(position) {
	const usercord={
		lat: position.coords.latitude,
		lon: position.coords.longitude,
	}

	sessionStorage.setItem("user-coordinates",JSON.stringify(usercord));
	fetchweatherCoordinates(usercord);
	
}



const grantbutton=document.querySelector("[data-grantaccess]");

grantbutton.addEventListener('click',getLoaction);
 


const searchinput=document.querySelector("[data-searchcity]");

searchform.addEventListener("submit",(e)=>{
	e.preventDefault();
	let name=searchinput.value;

	if(name===""){
		return;
	}else{
		searchbycity(name);
	}
});


async function searchbycity(city){
	loadingscreen.classList.add("active");
	usercontain.classList.remove("active");
	grantlocation.classList.remove("active");

	try{
		const res=await fetch('https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid='+apikey);
		const result=await res.json();

		usercontain.classList.add("active");
		renderinfo(result);


	}catch(err){
		alert("enter proper city name");
	}
	loadingscreen.classList.remove("active");
}







