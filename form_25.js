jQuery(document).ready(function() {
  jQuery("#adm_cloner_listas___model").on('change', function() {
    jQuery(".classAddManual").remove();
    var listid = jQuery("[name='listid']").val();
    var tableModel = jQuery("#adm_cloner_listas___model").val();
    var url = "/components/com_fabrik/nomesListCloner.php?tableModel=" + tableModel + "&listid=" + listid;
    if(tableModel != '') {
      jQuery.post(url, {}, function(response) {
        var result = JSON.parse(response);

        if(result.sucesso != '' && result.erro == '') {
          var msg = result.sucesso;
          SetPrincipal(result);
          SetAuxiliares(result);
          //SetExtras(result);
        }
        
        if(result.sucesso == '' && result.erro != '') {
          var msg = result.erro;
          alert(msg);
        }
      });
    }
  });
});

function SetPrincipal(result) {
  jQuery(".fabrikGroup").append(htmlLinha('principal'));
  jQuery(".principal").append(htmlLabel(result.nomeListaPrincipal, 'Nome da Lista Principal'));
  jQuery(".principal").append(htmlElement(result.tabelaListaModelo, 'principal', 'list', 'Nome da Lista'));
  jQuery(".principal").append(htmlElement(result.tabelaListaModelo, 'principal', 'table', 'Nome da Tabela', result.sugestaoListaPrincipal));
}

function SetAuxiliares(result) {
  result.arrAuxiliares.forEach((element, index) => {
    if(element.nome !== null && element.id !== null) {
      jQuery(".fabrikGroup").append(htmlLinha('auxiliar_'+(index+1)));
      jQuery('.auxiliar_'+(index+1)).append(htmlLabel(element.nome, 'Nome da Lista Auxiliar '+(index+1)));
      jQuery('.auxiliar_'+(index+1)).append(htmlElement(result.tabelaListaModelo, 'auxiliar_'+(index+1), 'list', 'Nome da Lista'));
      jQuery('.auxiliar_'+(index+1)).append(htmlElement(result.tabelaListaModelo, 'auxiliar_'+(index+1), 'table', 'Nome da Tabela', element.sugestao));
    }
  });
}

function SetExtras(result) {
  jQuery(".fabrikGroup").append(htmlLinha('extras'));
  jQuery(".extras").append(htmlBotao(result.tabelaListaModelo, 'Criar Lista no Menu'));
}

function htmlLinha(id) {
  style = "padding:0px 30px;";
  style += "display: flex;";
  style += "flex-direction: row;";
  style += "margin-bottom: 20px;";
  style += "padding-top: 10px;";

  if(id != 'extras') {
    style += "background-color:#eee;";
  }

  if(id == 'principal') {
    style += "margin-top: 50px;";
  }
 
  html = '<div class="row-fluid classAddManual ' + id + '" style="' + style + '">';
  html +='</div>';

  return html;
}

function htmlLabel(labelPrincipal, label) {
  style = "width:250px;";
  style += "display: flex;";
  style += "flex-direction: column;";
  style += "align-items: center;";
  style += "margin: -1px 0px 0px 0px !important;";

  html = '<p style="' + style +'"><b>' + label + ':</b><span style="margin-top: 12px;">' + labelPrincipal + '</span></p>';

  return html;
}

function htmlElement(tabelaListaModelo, id, tipo, label, value='') {
  html =  '<div class="control-group fabrikElementContainer plg-field fb_el_' + tabelaListaModelo + '___' + tipo + '_name_' + id + ' fabrikDataEmpty span6">';
  html +=    '<label for="' + tabelaListaModelo + '___' + tipo + '_name_' + id + '" class="fabrikLabel control-label">' + label + '</label>';
  html +=    '<div class="fabrikElement">';
  html +=      '<input type="text" id="' + tabelaListaModelo + '___' + tipo + '_name_' + id + '" name="' + tabelaListaModelo + '___' + tipo + '_name_' + id + '" size="10" maxlength="255" class="input-medium form-control fabrikinput inputbox text" value="' + value + '">';
  html +=    '</div>';
  html +=    '<div class="fabrikErrorMessage">';
  html +=    '</div>';
  html +=  '</div>';

  return html;
}

function htmlBotao(tabelaListaModelo, label) {
  html = '<div class="control-group fabrikElementContainer plg-yesno fb_el_' + tabelaListaModelo + '___listas_menu span6">';
  html +=  '<label for="' + tabelaListaModelo + '___listas_menu" class="fabrikLabel control-label">';
  html +=    label;
  html +=  '</label>';
  html +=  '<div class="fabrikElement">';
  html +=    '<div class="fabrikSubElementContainer" id="' + tabelaListaModelo + '___listas_menu">';
  html +=      '<fieldset class="radio btn-radio btn-group" data-toggle="buttons" style="padding-top:0px!important">';
  html +=        '<label for="' + tabelaListaModelo + '___listas_menu_input_0" class="fabrikgrid_0 btn-default btn active btn-danger">';
  html +=          '<input type="radio" class="fabrikinput " name="' + tabelaListaModelo + '___listas_menu[]" id="' + tabelaListaModelo + '___listas_menu_input_0" value="0" checked="checked">';
  html +=          '<span>Não</span>';
  html +=        '</label>';
  html +=        '<label for="' + tabelaListaModelo + '___listas_menu_input_1" class="fabrikgrid_1 btn-default btn ">';
  html +=          '<input type="radio" class="fabrikinput" name="' + tabelaListaModelo + '___listas_menu[]" id="adm_cloner_listas___listas_menu_input_1" value="1">';
  html +=          '<span>Sim</span>';
  html +=        '</label>';
  html +=       '</fieldset>';
  html +=      '</div>';
  html +=    '</div>';
  html +=    '<div class="fabrikErrorMessage"></div>';
  html +=  '</div>';
  html += '</div>';

  return html;
}