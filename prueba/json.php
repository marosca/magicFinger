
<?php
function readFolderDirectory($dir,$listDir= array())
{
    $listDir = array();
    if($handler = opendir($dir))
    {
        while (($sub = readdir($handler)) !== FALSE)
        {
            if ($sub != "." && $sub != ".." && $sub != "Thumb.db")
            {
                if(is_file($dir."/".$sub))
                {
                    $listDir[] = $sub;
                }elseif(is_dir($dir."/".$sub))
                {
                    $listDir[$sub] = $this->ReadFolderDirectory($dir."/".$sub); 
                } 
            } 
        }    
        closedir($handler); 
    } 
    return $listDir;    
}

/*
$estructura = readFolderDirectory ('/prueba');
echo json_encode($estructura);
*/



$arr = array('a' => 1, 'b' => 2, 'c' => 3, 'd' => 4, 'e' => 5);

echo json_encode($arr);
?>

