# SLAK-BOT TEAMPULSE

## Objetivo general

- Determinar la intencionalidad de los mensajes compartidos en los canales públicos en slack

## Objetivos específicos

- Analizar las distribuciones de los datos e identificar la intencionalidad de los mensajes
- Clasificar los mensajes en POSITIVOS, NEGATIVOS o NEUTROS
- Analizar la cantidad de emojis y reacciones compartida en cada canal. 
- Obtener el top 5 de emojis y reacciones.
- Obsevar la variación de la intencionalidad de los mensajes en el tiempo
- Obtener el top 10 de palabras mas usadas globales y en frases positivas y negativas

## Descripción

* DESCARGA DE MENSAJES: Para descargar los mensajes compartidos en los canales públicos de slack, el bot se conecta a la API 
de slack utilizando los tokens de acceso. Los tokens deben ser pasados en duro o como variables de entorno en el código del bot. 
Los tokens necesarios son;
    * SLACK_SIGNING_SECRET
    * SLACK_BOT_TOKEN 
    * VERIFICATION_TOKEN 

* OBTENCIÓN DE TOKENS: Para obtener los tokens, es necesario crear una API para el bot desde slack,
    * Desde la Api de Slack en los botones superiores (arriba y a la derecha de la pantalla) seleccionar: YOUR APPS
    * Luego, seleccionar la opción CREATE NEW APP.
    * Seteamos el nombre del bot ("TeamPulse_Bot") y seleccionamos un workspace donde utilizaremos el bot ("Teampulse")
    * Agregamos nuestro bot a nuestro espacio de trabajo
    * Una vez que la App fue instalada, obtendremos nuestros Tokens de usuario Bot  

* MÉTODOS: Según los métodos que se utilicen en el código del bot, posteriormente se deben setear los scopes necesarios.
    * **conversations.list**: Lista todos los canales en un grupo de Slack.
    * **conversations.history**: Obtiene el historial de mensajes y eventos de una conversación.

* SETEO DE SCOPES: Es necesario setear los **scopes** del bot en https://api.slack.com/apps/A01C9PPRZLZ/oauth?
    * **Bot Token Scopes:**
        * app_mentions:read
        * emoji:read
        * incoming-webhook
        * reactions:read
        * mpim:read
        * users:read
        * channels:read 
        * im:read
        * groups:read
        * mpim:read
        * channels:history
        * groups:history
        * im:history
        * mpim:history

    * **User Token Scopes:**
        * im:read
        * channels:read
        * groups:read
        * mpim:read
        * channels:history
        * groups:history
        * im:history
        * mpim:history    

* INVITACIÓN DEL BOT: El bot debe ser invitado a los canales públicos. 
En cada canal se puede escribir el siguiete mensaje **/invite @BOT_NAME**. 
Luego se debe aceptar la pregunta que aparecerá preguntando si queremos agregar el bot al canal.

* TIEMPO DE DESCARGA: En el archivo "cron-file" se seteará el tiempo deseado para que se ejecute el código del bot 
y descargue los mensajes de los canales públicos en los que está invitado.

## Base de datos

* Se crean dos bases de datos:
    * Slack_historial_de_mensajes.csv: Almacenana todos los mensajes descargados, junto a la información de: 
      fecha, canal, usuario, emojis, archivos adjuntos, reacciones, etc.
    * Channels.csv: Almacenana un registro del Id de cada canal y su nombre. Guardará el último nombre asignado al canal.

* Optimización:
    * Se elimina la variable "Channel_name" de la base de datos Slack_historial_de_mensajes.csv, por dos motivos:
        * Ahorrar espacio en el almacenado de datos, para no guardar tantas veces las mismas cadenas de strings
        * Evitar el problema del cambio del nombre de canal. Al cambiar el nombre el canal es considerado como uno nuevo, 
        y los mensajes serán agrupados separados en el aálisis, en nuevo_nombre y viejo_nombre. En cambio el Id del canal no cambia.
    * Se almacenará el nombre actual del canal ("Channel_name") en un dataset separado (channels.csv) y luego se realizará 
    al momento del análisis un merge de las dos bases de datos (notebook 02 y 03) para poder obtener el nombre actual de los canales 
    y presentar los gráficos apropiadamente.




