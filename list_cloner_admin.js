/**
 * List Cloner Admin
 *
 */

define(['jquery', 'fab/fabrik'], function (jQuery, Fabrik) {
	'use strict';
	var list_cloner_admin = new Class({
        Implements: [Events],
        
		options: {
		},


		/**
		 * Initialize
		 * @param {object} options
		 */
		initialize: function (options) {
            var self = this;
            var actualTable = jQuery("[name='actualTable']").val();
            
            var isRadio = jQuery("#" + actualTable + "___model").closest('.fabrikElementContainer').attr('class').indexOf('mode-radio');
            if(isRadio < 0 ) {
                jQuery("#" + actualTable + "___model").on('change', function() {
                    self.actionChange(false);
                });
            } else {
                jQuery("#" + actualTable + "___model input[type='radio']").on('change', function() {
                    self.actionChange(true);
                });
                self.actionChange(true);
            }

            Fabrik.addEvent('fabrik.form.submit.start', function (form) {
                var self = this;
                var response = true;
                var elementError = '';

                jQuery('.list_cloner_element').closest('.fabrikElementContainer').find('.fabrikLabel').css('color', '#333840');
                jQuery("#adm_cloner_listas___name").val(jQuery('#adm_cloner_listas___list_name_principal').val());

                jQuery('.list_cloner_element').each(function (key, element) {
                    var origValue = jQuery(element).attr('orig_value').replace('_', '');
                    var actualValue = element.value;

                    if(actualValue == '' || origValue == actualValue) {
                        if(response) {
                            elementError = element;
                        }
                        response = false;
                    }
                });

                if(!response) {
                    form.result = response;
                    jQuery(elementError).closest('.fabrikElementContainer').find('.fabrikLabel').css('color', '#FF4444');
                    alert('Os nomes das listas não podem ter o mesmo nome padrão ou estarem vazios. Altere ou complemente o nome da sua lista como desejado.');
                }
            }.bind(this));
        },
        
        actionChange: function(isRadio) {
            var self = this;

            jQuery(".classAddManual").remove();

            var listid = jQuery("[name='listid']").val();
            var listModel = jQuery("[name='listModel']").val();
            var actualTable = jQuery("[name='actualTable']").val();
            var easy = jQuery("[name='easy']").val();

            var tableModel = isRadio ? jQuery("#" + actualTable + "___model input[name='" + actualTable + "___model[]']:checked").val() : jQuery("#" + actualTable + "___model").val();
            var url = "/plugins/fabrik_form/list_cloner_admin/list_cloner_names.php?tableModel=" + tableModel + "&listid=" + listid + "&listModel=" +    listModel;

            if(tableModel != '') {
                jQuery.post(url, {}, function(response) {
                    var result = JSON.parse(response);
            
                    if(result.sucesso != '' && result.erro == '') {
                        var msg = result.sucesso;
                        self.setPrincipal(result, easy);
                        self.setAuxiliares(result, easy);
                    }
                    
                    if(result.sucesso == '' && result.erro != '') {
                        var msg = result.erro;
                        alert(msg);
                    }
                });
            }
        },

        setPrincipal: function (result, easy) {
            var self = this;
            var nameSuggest = '';

            jQuery(".fabrikGroup").append(self.htmlLinha('principal'));
            
            if(easy == '1') {
                nameSuggest = result.nomeListaPrincipal.replace('_', '');
            } else {
                jQuery("#group1 .principal").append(self.htmlLabel(result.nomeListaPrincipal, 'Nome da Lista Principal'));
            }

            jQuery("#group1 .principal").append("<div style='display: flex; justify-content: start; width: 100%;'></div>");
            jQuery("#group1 .principal > div").append(self.htmlElement(result.tabelaListaModelo, 'principal', 'list', 'Altere ou complemente o nome da sua lista:', nameSuggest));
            easy != '1' ? jQuery("#group1 .principal > div").append(self.htmlElement(result.tabelaListaModelo, 'principal', 'table', 'Nome da Tabela', result.sugestaoListaPrincipal)) : '';
        },

        setAuxiliares: function (result, easy) {
            var self = this;
            result.arrAuxiliares.forEach((element, index) => {
                if(element.nome !== null && element.id !== null) {
                    var nameSuggest = '';
                    jQuery(".fabrikGroup").append(self.htmlLinha('auxiliar_'+(index+1)));
                    
                    if(easy == '1') {
                        var nameSuggest = element.nome.replace('_', '');
                    } else {
                        jQuery('#group1 .auxiliar_'+(index+1)).append(self.htmlLabel(element.nome, 'Nome da Lista Auxiliar '+(index+1)));
                    }
                    
                    jQuery('#group1 .auxiliar_'+(index+1)).append("<div style='display: flex; justify-content: start; width: 100%;'></div>");
                    jQuery('#group1 .auxiliar_'+(index+1)+' > div').append(self.htmlElement(result.tabelaListaModelo, 'auxiliar_'+(index+1), 'list', 'Altere ou complemente o nome da sua lista:', nameSuggest));
                    easy != '1' ? jQuery('#group1 .auxiliar_'+(index+1)+' > div').append(self.htmlElement(result.tabelaListaModelo, 'auxiliar_'+(index+1), 'table', 'Nome da Tabela', element.sugestao)) : '';
                }
            });
        },

        htmlLinha: function (id) {
            var style = '';
            var html = '';

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
        },

        htmlLabel: function (labelPrincipal, label) {
            var style = '';
            var html = '';

            style = "width:250px;";
            style += "display: flex;";
            style += "flex-direction: column;";
            style += "align-items: center;";

            html = '<p style="' + style +'"><b>' + label + ':</b><span style="margin-top: 12px;">' + labelPrincipal + '</span></p>';

            return html;
        },

        htmlElement: function (tabelaListaModelo, id, tipo, label, value='') {
            var html = '';

            html =  '<div class="control-group fabrikElementContainer plg-field fb_el_' + tabelaListaModelo + '___' + tipo + '_name_' + id + ' fabrikDataEmpty span6">';
            html +=    '<label for="' + tabelaListaModelo + '___' + tipo + '_name_' + id + '" class="fabrikLabel control-label">' + label + '</label>';
            html +=    '<div class="fabrikElement">';
            html +=      '<input type="text" id="' + tabelaListaModelo + '___' + tipo + '_name_' + id + '" name="' + tabelaListaModelo + '___' + tipo + '_name_' + id + '" maxlength="255" size="50" orig_value="' + value + '" class="input-medium form-control fabrikinput inputbox text list_cloner_element" value="' + value + '">';
            html +=    '</div>';
            html +=    '<div class="fabrikErrorMessage">';
            html +=    '</div>';
            html +=  '</div>';

            return html;
        }
	});

	return list_cloner_admin;
});