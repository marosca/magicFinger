<?php
   function getFileList($dir)
  {
    // array to hold return value
    $retval = array();

    // add trailing slash if missing
    if(substr($dir, -1) != "/") $dir .= "/";

    // open pointer to directory and read list of files
    $d = @dir($dir) or die("getFileList: Failed opening directory $dir for reading");

    $count= 0;

    while(false !== ($entry = $d->read())) {
          // skip hidden files
          if($entry[0] == ".") continue;
          
          if(is_dir("$dir$entry")) { // si es un directorio
                $retval[] = array(
                  "num" => ++$count,
                  "text" => ucwords($entry),
                  "img" =>  "$dir$entry/".$entry."_home.png",
                  "contenido" => getFileList("$dir$entry/")
                );

          } elseif( is_readable("$dir$entry") && strripos("$dir$entry", "_thumb")) { // si es un archivo
                $retval[] = array(
                  "text" => "Dibujo de ". substr( ucwords($entry), 0, -10 ),
                  "img" => "$dir$entry",
                  "canvas" => substr( "$dir$entry", 0, -9 )."canvas".substr( "$dir$entry", -4 )
                );
          }

    }// fin de while
    $d->close();

    return $retval;
  }

$listado = getFileList("photo", true);
//echo "<pre>",print_r($listado),"</pre>";
echo json_encode($listado);


?>