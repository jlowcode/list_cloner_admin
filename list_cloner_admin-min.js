define(["jquery","fab/fabrik"],(function(a,e){"use strict";return new Class({Implements:[Events],options:{},initialize:function(i){var l=this,t=a("[name='actualTable']").val(),n=a("[name='easy']").val();a("#"+t+"___model").on("change",(function(){a(".classAddManual").remove();var e=a("[name='listid']").val(),i=a("[name='listModel']").val(),s=a("#"+t+"___model").val(),r="/plugins/fabrik_form/list_cloner_admin/list_cloner_names.php?tableModel="+s+"&listid="+e+"&listModel="+i;""!=s&&a.post(r,{},(function(a){var e=JSON.parse(a);if(""!=e.sucesso&&""==e.erro){var i=e.sucesso;l.setPrincipal(e,n),l.setAuxiliares(e,n)}if(""==e.sucesso&&""!=e.erro){i=e.erro;alert(i)}}))})),e.addEvent("fabrik.form.submit.start",function(e){var i=!0,l="";a(".list_cloner_element").closest(".fabrikElementContainer").find(".fabrikLabel").css("color","#333840"),a("#adm_cloner_listas___name").val(a("#adm_cloner_listas___list_name_principal").val()),a(".list_cloner_element").each((function(e,t){var n=a(t).attr("orig_value"),s=t.value;""!=s&&n!=s||(i&&(l=t),i=!1)})),i||(e.result=i,a(l).closest(".fabrikElementContainer").find(".fabrikLabel").css("color","#FF4444"),alert("Os nomes das listas não podem ter o mesmo nome padrão ou estarem vazios. Altere ou complemente o nome da sua lista como desejado."))}.bind(this))},setPrincipal:function(e,i){var l=this,t="";a(".fabrikGroup").append(l.htmlLinha("principal")),"1"==i?t=e.nomeListaPrincipal:a(".principal").append(l.htmlLabel(e.nomeListaPrincipal,"Nome da Lista Principal")),a(".principal").append("<div style='display: flex; justify-content: start; width: 100%;'></div>"),a(".principal > div").append(l.htmlElement(e.tabelaListaModelo,"principal","list","Altere ou complemente o nome da sua lista:",t)),"1"!=i&&a(".principal > div").append(l.htmlElement(e.tabelaListaModelo,"principal","table","Nome da Tabela",e.sugestaoListaPrincipal))},setAuxiliares:function(e,i){var l=this;e.arrAuxiliares.forEach(((t,n)=>{if(null!==t.nome&&null!==t.id){var s="";if(a(".fabrikGroup").append(l.htmlLinha("auxiliar_"+(n+1))),"1"==i)s=t.nome;else a(".auxiliar_"+(n+1)).append(l.htmlLabel(t.nome,"Nome da Lista Auxiliar "+(n+1)));a(".auxiliar_"+(n+1)).append("<div style='display: flex; justify-content: start; width: 100%;'></div>"),a(".auxiliar_"+(n+1)+" > div").append(l.htmlElement(e.tabelaListaModelo,"auxiliar_"+(n+1),"list","Altere ou complemente o nome da sua lista:",s)),"1"!=i&&a(".auxiliar_"+(n+1)+" > div").append(l.htmlElement(e.tabelaListaModelo,"auxiliar_"+(n+1),"table","Nome da Tabela",t.sugestao))}}))},htmlLinha:function(a){var e="",i="";return e="padding:0px 30px;",e+="display: flex;",e+="flex-direction: row;",e+="margin-bottom: 20px;",e+="padding-top: 10px;","extras"!=a&&(e+="background-color:#eee;"),"principal"==a&&(e+="margin-top: 50px;"),i='<div class="row-fluid classAddManual '+a+'" style="'+e+'">',i+="</div>"},htmlLabel:function(a,e){return"width:250px;","display: flex;","flex-direction: column;","align-items: center;",'<p style="width:250px;display: flex;flex-direction: column;align-items: center;"><b>'+e+':</b><span style="margin-top: 12px;">'+a+"</span></p>"},htmlElement:function(a,e,i,l,t=""){var n="";return n='<div class="control-group fabrikElementContainer plg-field fb_el_'+a+"___"+i+"_name_"+e+' fabrikDataEmpty span6">',n+='<label for="'+a+"___"+i+"_name_"+e+'" class="fabrikLabel control-label">'+l+"</label>",n+='<div class="fabrikElement">',n+='<input type="text" id="'+a+"___"+i+"_name_"+e+'" name="'+a+"___"+i+"_name_"+e+'" maxlength="255" size="50" orig_value="'+t+'" class="input-medium form-control fabrikinput inputbox text list_cloner_element" value="'+t+'">',n+="</div>",n+='<div class="fabrikErrorMessage">',n+="</div>",n+="</div>"}})}));