<?php
	define('_JEXEC', 1);

	// defining the base path.
	if (stristr( $_SERVER['SERVER_SOFTWARE'], 'win32' )) {
    	define( 'JPATH_BASE', realpath(dirname(__FILE__).'\..\..\..' ));
	} else {
		define( 'JPATH_BASE', realpath(dirname(__FILE__).'/../../..' ));
	}

	define('DS', DIRECTORY_SEPARATOR);
	
	// including the main joomla files
	require_once(JPATH_BASE.'/includes/defines.php');
	require_once(JPATH_BASE.'/includes/framework.php');
	
	// Creating an app instance 
	$app = JFactory::getApplication('site');
	
	$app->initialise();
	jimport('joomla.user.user');
	jimport('joomla.user.helper');

	// Dados do Form e Pré Estabelecidos //
	$idTableModel = $_GET['tableModel'];
	$idlista = $_GET['listid'];
	$listModel = $_GET['listModel'];

	// Ligação ao banco de dados //	
	$db = JFactory::getDbo();
	$query = $db->getQuery(true);
	$prefix = $db->getPrefix();

	$query->clear()
		  ->select($db->quoteName('db_table_name') . 'AS tabelaListaModelo')
		  ->from($db->quoteName($prefix . 'fabrik_lists') . 'AS l')
		  ->where('l.id = "' . $idlista . '"');

	$db->setQuery($query);
	$result = $db->loadObject();
	$tabelaListaModelo = $result->tabelaListaModelo;

	// Consulta ao projeto modelo //
	$query->clear()
		  ->select([
				'm.' . $db->quoteName('name') . 'AS nomeListaModelo',
				'm.' . $db->quoteName('user') . 'AS idUsuario',
				'm.' . $db->quoteName('main_list') . 'AS idListaPrincipal',
			    'e.' . $db->quoteName('extra_lists') . 'AS idExtras',
			    'l.' . $db->quoteName('label') . 'AS nomeListasAux',
			    'l.' . $db->quoteName('db_table_name') . 'AS nomeTableAux',
			    'le.' . $db->quoteName('label') . 'AS nomeListaPrincipal',
			    'le.' . $db->quoteName('db_table_name') . 'AS nomeTablePrincipal',
			])
		  ->from($db->quoteName($listModel) . 'AS m')
		  ->join('LEFT', $db->quoteName($listModel . '_repeat_extra_lists') . 'AS e ON m.id = e.parent_id')
		  ->join('LEFT', $db->quoteName($prefix . 'fabrik_lists') . 'AS l ON e.extra_lists = l.id')
		  ->join('LEFT', $db->quoteName($prefix . 'fabrik_lists') . 'AS le ON m.main_list = le.id')
		  ->where('m.id = "' . $idTableModel . '"');

	$db->setQuery($query);
	$result = $db->loadObjectList();
	
	$nomeListaModelo = $result['0']->nomeListaModelo;
	$usuario = $result['0']->idUsuario;
	$nomeListaPrincipal = $result['0']->nomeListaPrincipal;
	$idListaPrincipal = $result['0']->idListaPrincipal;
	$nomeTablePrincipal = $result['0']->nomeTablePrincipal;

	$resultExtras = array();
	foreach($result as $key => $relacao) {
		$resultExtras[$key]["id"] = $relacao->idExtras;
		$resultExtras[$key]["nome"] = $relacao->nomeListasAux;
		$resultExtras[$key]["nomeTable"] = $relacao->nomeTableAux;
		if($resultExtras[$key]["nomeTable"]) {
			$resultExtras[$key]["sugestao"] = checkTableName($resultExtras[$key]["nomeTable"], $usuario);
		}
	}

	if(!empty($result)) {
		$resultTotal = array(
			"nomeListaModelo" => $nomeListaModelo,
			"usuario" => $usuario,
			"nomeListaPrincipal" => $nomeListaPrincipal,
			"idListaPrincipal" => $idListaPrincipal,
			"sugestaoListaPrincipal" => checkTableName($nomeTablePrincipal, $usuario),
			"arrAuxiliares" => $resultExtras,
			"tabelaListaModelo" => $tabelaListaModelo,
			"sucesso" => "Sucesso",
			"erro" => "",
		);
	} else {
		$resultTotal = array(
			"sucesso" => "",
			"erro" => "Erro, por favor tente novamente",
		);
	}

	echo json_encode($resultTotal);	

	function checkTableName ($name, $usuario) {
        $db = JFactory::getDbo();

        $name = $usuario . '_' . $name;
        $continue = false;
        $flag = 1;
        while ($continue === false) {
            $db->setQuery("SHOW TABLES LIKE '{$name}_{$flag}'");
            $result = $db->loadResult();
            if ($result) {
                $flag++;
            } else {
                $continue = true;
            }
        }

        return $name . "_{$flag}";
    }
?>