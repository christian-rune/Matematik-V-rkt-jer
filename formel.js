( function () {//Scope

takeCare=function(e){
	e=e||event;
	var tast=e.which||e.keyCode;
	if (tast==13) {
		beregnClick();
	};
};

function fix(x){return x.toString().replace(/\,/g,".");};

function init(){

	beregnClick=function(){
		var regnestykke="0", facit, del=FS.hid("indel").value, helhed=FS.hid("inhelhed").value, prct=FS.hid("inprocent").value;
		del=fix(del); helhed=fix(helhed); prct=fix(prct);
		var t=0, hb; if (del==""){t++; hb="del"}; if (helhed==""){t++; hb="helhed"}; if (prct==""){t++; hb="procent"};
		
		var tt=0;
		var delt=parseFloat(del); if (isNaN(delt) && del!="") {tt++; alert("Fejl i Del"); FS.hid("indel").select();};
		var helhedt=parseFloat(helhed); if (isNaN(helhedt) && helhed!="") {tt++; alert("Fejl i Helhed"); FS.hid("inhelhed").select();};
		var prctt=parseFloat(prct); if (isNaN(prctt) && prct!="") {tt++; alert("Fejl i Procent"); FS.hid("inprocent").select();};

		regnestykke=""; FS.hid("vis").innerHTML=regnestykke;
		if (t==1 && tt==0) {
			if (hb=="procent"){
				if (helhedt==0) {
					alert("Tallet for Helheden må ikke være 0");
					facit=""; FS.hid("inhelhed").select();
				} else {
					facit=Math.round(1000*delt/helhedt)/1000;
					facit=facit.toString().replace(".",",");
					regnestykke=delt+"/"+helhedt+" = "+facit;
				}
			};

			if (hb=="del"){
				facit=Math.round(1000*helhedt* prctt)/1000;
				facit=facit.toString().replace(".",",");
				regnestykke=helhedt+" &#183; "+prctt+" = "+facit;
			};

			if (hb=="helhed"){
				if (prctt==0) {
					alert("Tallet for procentdelen må ikke være 0");
					facit=""; FS.hid("inprocent").select();
				} else {
					facit=Math.round(1000*delt/prctt)/1000;
					facit=facit.toString().replace(".",",");
					regnestykke=delt+"/"+prctt+" = "+facit;
				};
			};


			FS.hid("in"+hb).style.color="blue";
			FS.hid("in"+hb).value=facit;
			FS.hid("vis").innerHTML="Regnestykke: "+regnestykke;
		} else {
			alert("1 felt skal være blankt og 2 andre skal indeholde tal");
		};

	};//END beregnClick

	forfraClick=function(){
		FS.hid("indel").value=""; FS.hid("inhelhed").value=""; FS.hid("inprocent").value="";
		FS.hid("indel").style.color="black"; FS.hid("inhelhed").style.color="black"; FS.hid("inprocent").style.color="black";
		FS.hid("vis").innerHTML="";
	};

	FS.addEvent(window,"unload",slut);
	FS.addEvent(document,"keydown",takeCare);
	FS.addEvent(FS.hid("btBeregn"),"click",beregnClick);
	FS.addEvent(FS.hid("btForfra"),"click",forfraClick);
};

function slut(){

	FS.removeEvent(window,"unload",slut);
	FS.removeEvent(document,"keydown",takeCare);
	FS.removeEvent(FS.hid("btBeregn"),"click",beregnClick);
	FS.removeEvent(FS.hid("btForfra"),"click",forfraClick);
};

	FS.addEvent(window,"load",init);
	FS.addEvent(window,"unload",FS.finito);

})(); //end Scope
