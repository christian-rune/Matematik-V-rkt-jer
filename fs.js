var FS={

	hid: function(id){ return document.getElementById(id)},

	hentVaerdi:function(xminid,ad){
		var xmin=document.getElementById(xminid).value;
		var reu=/[^ abcdefghijklmnopqrstuvwxyzæøåABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ0-9\,\.\(\)\*\/\+\-\^]/i;

		xmin=FS.ddug(xmin);
		if (reu.test(xmin)) {
			alert("Et eller flere tegn kendes ikke af denne formelsamling"); document.getElementById(xminid).select();
			return "fejl";
		}
		else {  
			xmin=FS.theHat(xmin); xmin=FS.iM(xmin);
			try {
				xmin=eval(xmin); if (ad) xmin=Math.round(xmin*Math.pow(10,ad))/Math.pow(10,ad);
				if (isNaN(xmin) || !isFinite(xmin) ) {
					alert("Fejl i udtrykket/tallet"); document.getElementById(xminid).select();
					return "fejl"; 
				} 
				else {
					return xmin
				}
			} catch(err){
				alert("Fejl i udtrykket/tallet"); document.getElementById(xminid).select();
				return "fejl";
			}
		}//END xmin
	},//END hentVaerdi

	ddug:function(ur){
		var re=/\,/g; ur=ur.replace(re,".");//Decimalkomma til decimalpunktum
		re=/ /g; ur=ur.replace(re,"");//Fjerner mellemrum
		re=/x/g; ur=ur.replace(re,"(x)");//klarer x*... men dræber exp(...)
		re=/e\(x\)p/g; ur=ur.replace(re,"exp");//genopliver exp(...)
		//UNDERTRYKTE GANGETEGN
		re=/PI/g; ur=ur.replace(re,"(PI)");//klarer konstanten PI
		re=/E/g; ur=ur.replace(re,"(E)");//klarer konstanten E
		re=/X/g; ur=ur.replace(re,"x");//Konverterer X til x
		re=/\)(\w|\(|\.)/g;ur=ur.replace(re,")*$1");//indsætter undertrykte gangetegn efter højreparentes
		re=/(\d|\.|I|E)\(/gi;ur=ur.replace(re,"$1*(");//indsætter undertrykte gangetegn før venstreparentes
		re=/([a-d]|[f-z])(\d|\.)/gi;ur=ur.replace(re,"$1*$2");//indsætter undertrykte gangetegn mellem bogstav og tal - pånær e
		re=/(\d|\.)([a-d]|[f-z])/gi;ur=ur.replace(re,"$1*$2");//indsætter undertrykte gangetegn mellem tal og bogstav - pånær e
		re=/(\d|\.)(exp)/gi;ur=ur.replace(re,"$1*$2");//indsætter undertrykte gangetegn mellem tal og exp
		return ur
	},

	iM:function(ur){
		var re = /kvr/g;ur=ur.replace(re,"Math.sqrt");
		re = /num/g;ur=ur.replace(re,"Math.abs");
		re = /log/g;ur=ur.replace(re,"1/Math.log(10)*Math.log");
		re = /ln/g;ur=ur.replace(re,"Math.log");
		re = /exp/g;ur=ur.replace(re,"Math.exp");
		re = /pot/g;ur=ur.replace(re,"Math.pow");
		re = /sin/g;ur=ur.replace(re,"Math.sin");
		re = /cos/g;ur=ur.replace(re,"Math.cos");
		re = /tan/g;ur=ur.replace(re,"Math.tan");
		re = /PI/g;ur=ur.replace(re,"Math.PI");
		re = /E/g;ur=ur.replace(re,"Math.E");
		return ur
	},

theHat:function(udtryk){

var taltegn="0123456789.";
var taltegnU="0123456789.-";
var bogstaver="sincotalogexpkvrumt";
var theLot=udtryk;tt=[];

while (theLot.indexOf("^")>-1){
tt=[];
var pos=theLot.indexOf("^");
tt[0]=theLot.substring(0,pos);
tt[1]=theLot.substring(pos+1);
var l=tt[0].length-1;
var l1=tt[1].length;

//FØR ^ [roden]
if (tt[0].charAt(l-2)=="E" && tt[0].charAt(l-1)=="*" && tt[0].charAt(l)=="1"){//E
  tt[0]=tt[0].substring(0,l-2);//remove E*1
  tt[0]+="pot(E,"//and replace with pot(E
}
else if (tt[0].charAt(l-3)=="P" && tt[0].charAt(l-2)=="I" && tt[0].charAt(l-1)=="*" && tt[0].charAt(l)=="1"){//PI
  tt[0]=tt[0].substring(0,l-3);//remove PI*1
  tt[0]+="pot(PI,"//and replace with pot(PI
}
else if (tt[0].charAt(l)=="x") {//x
  tt[0]=tt[0].substring(0,l);//remove x
  tt[0]+="pot(x,"//and replace with pot(x
}
else if (taltegn.indexOf(tt[0].charAt(l))!=-1) {//tal
  var cifre=tt[0].charAt(l);
  var i=l-1;
  while (taltegn.indexOf(tt[0].charAt(i))!=-1 && i>=0){
    cifre=tt[0].charAt(i)+cifre;
    i=i-1;
  };
  tt[0]=tt[0].substring(0,i+1);//remove cifre
  tt[0]+="pot("+cifre+","//and replace with pot(cifre,
}
else if (tt[0].charAt(l)==")"){//")"
  var corres=1;//Søger efter den matchende venstreparentes
  for (var i=l-1; i>=0; i--){
    if (tt[0].charAt(i)=="(") {
      corres=corres-1
    };
    if (tt[0].charAt(i)==")") {
      corres=corres+1
    };
    if (corres==0){//matchende venstreparentes fundet i position jep og der fortsættes efter løkken
      var jep=i; break;
    };
  };//end for

  if (jep==0 || bogstaver.indexOf(tt[0].charAt(jep-1))==-1){//bare en parentes
    var parentesen=tt[0].substring(jep+1,l);//indmad af parentesen
    tt[0]=tt[0].substring(0,jep);//fjern parentesen
    tt[0]=tt[0]+"pot("+parentesen+",";//replace with
  }
  else {//funktion 
    var p=jep-1;
    while (bogstaver.indexOf(tt[0].charAt(p))!=-1 &&p>=0) {p--};p++;
    var indmaden=tt[0].substring(p,l+1);
    tt[0]=tt[0].substring(0,p);//fjern indmaden
    tt[0]=tt[0]+"pot("+indmaden+","//replace with
  }
};

//EFTER ^  [Eksponenten]
if (taltegnU.indexOf(tt[1].charAt(0))!=-1){//tal eller -
  var cifre=tt[1].charAt(0);
  var i=1;
  while (taltegn.indexOf(tt[1].charAt(i))!=-1 &&i<tt[1].length) {
    cifre+=tt[1].charAt(i);
    i++;
  };
  tt[1]=tt[1].substring(i,l1);
  tt[1]=cifre+")"+tt[1];
}
else if (tt[1].charAt(0)=="x"){//x
  tt[1]=tt[1].substring(1,l1);//remove x
  tt[1]="x)"+tt[1]//replace with x)
}
else if (tt[1].charAt(0)=="("){//(

  var corres=1;//Søger efter den matchende højreparentes
  for (var i=1; i<tt[1].length; i++){
    if (tt[1].charAt(i)==")") {
      corres=corres-1
    };
    if (tt[1].charAt(i)=="(") {
      corres=corres+1
    };
    if (corres==0){//matchende højreparentes fundet i position jep og der fortsættes efter løkken
      var jep=i; break;
    };
  };
  var parentesen=tt[1].substring(1,jep); //Indmaden af parentesen
  tt[1]=tt[1].substring(jep+1);//Fjern parentesen
  tt[1]=parentesen+")"+tt[1]//replace with...
}
else if (tt[1].charAt(0)=="E"){//E
  tt[1]=tt[1].substring(1,l1);//remove E
  tt[1]="E)"+tt[1]//replace with E)
}
else if (tt[1].charAt(0)=="P"){//PI
  tt[1]=tt[1].substring(2,l1);//remove PI
  tt[1]="PI)"+tt[1]//replace with PI)
}
else if (bogstaver.indexOf(tt[1].charAt(0))!=-1) {//funktionsnavn
  var corres=1;//Søger efter den matchende højreparentes
  for(var i=tt[1].indexOf("(")+1;i<tt[1].length;i++){//Find venstre parentes efter funktionsnavnet og start derfra
    if (tt[1].charAt(i)==")") {
      corres=corres-1
    };
    if (tt[1].charAt(i)=="(") {
      corres=corres+1
    };
    if (corres==0){//matchende højreparentes fundet i position jep og der fortsættes efter løkken
      var jep=i; break;
    };
  };
  var funktionskald=tt[1].substring(0,jep); //funktionskald
  tt[1]=tt[1].substring(jep);//Fjern funktionskald
  tt[1]=funktionskald+")"+tt[1]//replace with...
};

theLot=tt[0]+tt[1];//
}
  return theLot;
},//END theHat

	/* CrossBrowser-registrering af eventlisteners - addEvent, removeEvevnt uses MetaProgramming */

	addEvent: function(element,type,func){
		if (document.addEventListener) {
			addEvent=function(element,type,func){
				element.addEventListener(type,func,false);
			};
		} else {
			addEvent=function(element,type,func){
				element.attachEvent("on"+type,func)
			};
		};
		addEvent(element,type,func);
	},

	removeEvent: function(element,type,func){
		if (document.removeEventListener) {
			removeEvent=function(element,type,func){
				element.removeEventListener(type,func,false);
			};
		} else {
			removeEvent=function(element,type,func){
			element.detachEvent("on"+type,func)
			};
		};
		removeEvent(element,type,func);
	},

	finito: function(){
		FS.removeEvent(window,"load",init);
		FS.removeEvent(window,"unload",FS.finito);
	}


}//END FS
