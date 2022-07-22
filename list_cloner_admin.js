jQuery(document).ready(function() {
  var actualTable = jQuery("[name='actualTable']").val();
  jQuery("#" + actualTable + "___model").on('change', function() {
      jQuery(".classAddManual").remove();
      var listid = jQuery("[name='listid']").val();
      var listModel = jQuery("[name='listModel']").val();
      var tableModel = jQuery("#" + actualTable + "___model").val();
      var url = "/plugins/fabrik_form/list_cloner_admin/list_cloner_names.php?tableModel=" + tableModel + "&listid=" + listid + "&listModel=" + listModel;
      if(tableModel != '') {
          jQuery.post(url, {}, function(response) {
          var result = JSON.parse(response);
  
          if(result.sucesso != '' && result.erro == '') {
              var msg = result.sucesso;
              SetPrincipal(result);
              SetAuxiliares(result);
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