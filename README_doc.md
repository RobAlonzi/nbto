<style>
img{
	margin:10px 0;
}
</style>

<h1>Nuit Blanche Documentation</h1>
<p>This is the JS documentation for <a target="_blank" href="https://www.nbto.com">nbto.com</a>. Will also list any MODX issues we come across.</p>
<p><a target="_blank" href="https://staging.nuitblancheto.ca/">staging.nuitblancheto.ca</a></p>
<p><a target="_blank" href="http://testing.scotiabanknuitblanche.ca">testing.scotiabanknuitblanche.ca</a></p>

<p><strong>Please refer to supplied Word Document for all usernames/passwords</strong></p>

<hr />


<h2>Getting Envirnonment Set Up</h2>
<h3>Installing/Downloading neccessary files</h3>
<p>The code that we upload to the server for NB is not the code we manually edit. We edit src files and use the task-runner <a target="_blank" href="http://gulpjs.com/">Gulp</a> to actually build out and create the files that we then put onto the server.</p>

<p> We also have a <a target="_blank" href="https://bitbucket.org/">BitBucket</a> repository where we store all the source files for version control. </p>

<ol>
	<li>Install <a target="_blank" href="https://nodejs.org/en/download/current/">Node</a> for Windows. This will also install NPM.</li>
	<li>Install <a target="_blank" href="https://git-scm.com/download/win">Git</a> if you don’t already have it. Add the ‘git’ variable into your PATH so we can use the command from anywhere.</li>
	<li>We usually don’t install NPM packages globally, but for Gulp, we want to be able to access it anywhere, since it will be used in pretty much all projects. Open up your Node.js command prompt (should also be installed with Node) and type:
		<ol>
			<li><strong>npm install -g gulp</strong></li>
			<li><strong>npm install -g gulpjs/gulp-cli#4.0</strong> (This needs git to work, the gulp 4.0 compatible command line, we use gulp 4 in the local project folder for NB, even though we install gulp 3 globally)</li>
			<li>If the above command doesn’t work try this <strong>npm install -g gulp-cli</strong></li>
		</ol></li>
	<li>Pull the latest src files from the BitBucket repository into your working directory. <strong>git@bitbucket.org:kevin_wong__/nuitblanchegulp.git</strong></li>
	<li>Once the src files are cloned into your working local directory, type <strong>npm install</strong> to install all the dependencies we need for this project to build properly. After this is done you should see a new folder called 'node_modules' in your directory. <strong>NOTE: You need to use the Command Prompt with Node that you installed in step one. </strong></li>
</ol>

<p>It is important to note that the CSS is built using <a target="_blank" href="http://sass-lang.com/">SASS</a> and the JS is built using the <a target="_blank" href="http://wiki.commonjs.org/wiki/Modules/1.1">CommonJS module syntax</a> as well as <a target="_blank" href="http://es6-features.org/">Javascript ES6 syntax</a> where needed/possible.</p>

<hr />

<h3>Gulp Commands</h3>
<p>When you have finished the above steps, you are ready to start making edits to the source code. Since we use gulp as our build tool, we have set up a few gulp tasks to make things easier to generate the files needed for the server. You can use them by typing <strong>gulp {task}</strong> where task is a task defined in the gulpfile.js. There are a few of them:</p>

<ol>
<li><strong>dev:scripts</strong> - packages together all js files for staging. (sourcemaps and unminified)</li>
<li><strong>dev:styles</strong> - packages together all css files into one css file. (sourcemaps and unmimified)</li>
<li><strong>dev</strong> - runs both <strong>dev:scripts</strong> and <strong>dev:styles</strong></li>
<li><strong>dev:watch</strong> - runs the <strong>dev</strong> task first, then watches for any changes (certain files that are specifically set in the gulpfile, basically all JS and CSS src files) and re-runs the <strong>dev</strong> task if changes are made to any of these files. This one is likely to be used the most so you don't have to keep manually running tasks when you make any kind of edit.</li>
<li><strong>prod:scripts</strong> - packages together all js files for prod (no sourcemaps, uglified and minified)</li>
<li><strong>prod:styles</strong> - packages together all css files into one file (no sourcemaps, minified)
</li>
<li><strong>prod</strong> - runs both <strong>prod:scripts</strong> and <strong>prod:styles</strong></li>
<li><strong>doc</strong> - runs JSDoc functionality to rebuild documentation package</li>
</ol>

<p>So for example one full gulp command would be <strong>gulp dev:styles</strong>, which will run the task <strong>dev:styles</strong> and build out the CSS for our staging and testing websites.</p>

<hr />

<h3>Pushing Code onto the server</h3>
<p>After any gulp command that generates code (EX: not gulp doc), you will notice a <strong>dist</strong> folder in your working directory. This folder will have two folders inside <strong>stg</strong> or <strong>prod</strong>. Choose <strong>prod</strong> if you just built prod and need to push the code live, choose <strong>stg</strong> if you just build dev and are planning to push the code to local/test/stg. These folders won't appear until you run a task that builds to them.</p>
<p>Inside these folders will be two folders; <strong>scripts</strong> and <strong>styles</strong>. This is where you will find your built out JS or CSS files respectively. Push them to the following areas of the NB server:</p>
<ul>
<li>JS: $SITE_ROOT/svn/Web/release/assets/js/</li>
<li>CSS: $SITE_ROOT/svn/Web/release/assets/style/</li>
</ul>

<hr />

<h2>Notes about the MODX set-up</h2>
<h3>jsNeeded and page_id Global Variable</h3>
<p>In MODX, we set two global variables for the JS to use. One is simply the page_id the user is on. It is located in the <strong>Web_Common_Head</strong> and <strong>Mobile_Common_Head</strong> chunks. The code looks like this:</p>

<pre><code>var page_id = [[*id]];</code></pre>

<p>jsNeeded is built with a snippet called <strong>insertJSinHead</strong>. The snippet takes the value of the template variable <strong>Web_Content_JS_Includes</strong> (which is included on all templates). The TV is manipulated and added as a JS object into the head of the HTML document.</p>

<pre><code>var jsNeeded = {"tiles":true,"readmore":true};</code></pre>

<p>These are now global JS variables that the Snb.Main.js file uses to launch the JS needed for that particular page. Page ID is needed if the page needs to grab the Project Data JSON object (since the return data varies based on which page is calling it.</p>

<hr/>

<h3>Static Map Markers</h3>
<p>Static map markers are found in the desktop <strong>Project Api for Event Map</strong> resource (ID 279) in the MODX manager. If you flip over to the Template Variables tab you will see a MIGX of all the static markers appearing on the event map.</p>
<hr/>

<h3>Project Data JSON</h3>
<p>The <strong>Project Api for Event Map</strong> resource (ID 279 - web context, ID 299 for mobile context) each calls the snippet <strong>getProjectsJson</strong> (uncached) and returns the result to the JS.</p>

<p> The snippet has some hard coded definitions:</p>

<ol>
	<li>define("SPONSOR_PROJECT", 38); - Sponsor Project id</li>
	<li>define("COMMISSIONED_PROJECT", 36); - Commissioned Project id</li>
	<li>define("MAJOR_INSTITUTIONS", 34); - Major Institutions Project id</li>
	<li>define("INDEPENDENT_PROJECT", 32); - Independant Project id</li>
	<li>define("SITE_PATH", '/var/www/www.scotiabanknuitblanche.ca/web/public/'); - Path to web public folder</li>
</ol>

<p>A bunch of internal functions exist inside that are pulled from the code in the Project portal (how to correctly display artist etc). Some are created specifically for the data (info window content). These functions take the data from the snbproject_projects table and breaks them out into returnable fields that the JS can then use. A switch statement determines what info to collect (setting the filters needed when calling the DB).</p>

<p>The call to the DB is made to get all projects where status_id = 1 (active) and if we need to filter by type and zone that is done as well. Then a loop is created that adds the info for each project we need into an output array and sorts by map number. If static markers are needed they get added at the end as well. When the output array is finished it returns the array but inside a json_encode function to the return is valid JSON.</p>



<hr/>


<h3>Turn off sessions night of event</h3>
<p>In 2016, the site was failing (returning a 500 error) under heavy load. It appears to be something that has to do with the MODX session table being overloaded, and not accepting new sessions, causing the page to crash. When you enter a MODX website, logged in or not, MODX gives your user a session and a group (anonymous).</p>
<p>Since 99% of users don't actually need a session (only the portal users need sessions), our solution was to turn off sessions on the night of the event. The portal should be 100% ready to go by night of and if a change is needed you can turn on sessions for a limited amount of time (not reccommended however).</p>
<p>Mobile context sessions are not needed and can be left off throughtout the year, Manager context sessions are always needed and always left on (never enough users logged in to cause the issues as above).</p>

<ol>
	<li>Log into the Manager, and head to Context Settings.</li>
	<li>Right click <strong>web</strong> context, and click "Update Context"</li>
	<li>Click to "Context Settings" tab and change the <strong>'session_enabled'</strong> value to 'No'.</li>
	<li>Save the setting.</li>
</ol>
<p><strong>NOTE:</strong> With sessions set to 'No', the portal will cease to work since that is in the web context and the log-in functionality won't be able to give the user a session after logging in.</p>

<p><strong>UPDATE: We have installed Memcached to the server which hopefully fixes this problem but it has yet to be tested out. Memcached is running on the LIVE site only</strong>. See <a target="_blank" href="https://modx.com/blog/2012/09/24/using-memcached-for-modx-caching/">Using memcached for MODX Caching</a> for details.</p>


<h2>Other</h2>
<h3>Rebuild Project JSON Manager Page</h3>
<p>Inside the manager, there is a menu item located under the <strong>Extras</strong> top level, called <strong>Rebuild Project Data JSON</strong>. Clicking on this reveals a small message that says 'Project JSON Data Rebuilt'.</p>

<p>Closer to the night of, we noticed a lot of traffic to the server which meant a lot of database calls. In an effort to reduce server load we decided to save out the JSON that gets returned to the Javascript via a call to '/event-map-api.js' (as described above).</p>

<p>A problem we had was we didn't have a way to make changes to this json file should a change to one of the projects happen (resulting in old data in the json file). To fix this, we made a very simple Custom MODX Manager page that asked for the data and re-saved the json files accordingly.</p>

<p>If you look in Settings->Namespaces you will see an entry <strong>projectjson</strong> whose files are stored in <strong>{core_path}components/projectJson/</strong>. If you open up these files on the server you will see a basic MODX controller <strong>{core_path}components/projectJson/controllers/default/index.class.php</strong>. This file may need updating year to year.</p>

<ul>
<li>An array is hardcoded in this file that has each type of json needed (one for each request possible). </li>
<li>For each of these values, it runs the MODX snippet (getProjectsJson), passing along special parameters to return the exact data as if that page was calling it.</li>
<li>It then rewrites the json file in the location also hard-coded in </li>
</ul>

<p><strong>NOTE:</strong> You also have to change the getProjectsJson snippet itself to begin pulling from the JSON instead of requesting from the DB directly. We only set this up closer to the event to reduce a bit of load but most of the year it's fine to leave this feature off, since project data changes happen frequently througout the year. To have the snippet return JSON instead of accessing the DB, uncomment the code on lines 365-367 in the snippet:</p>

<pre><code>
if(!$rebuildJson){
    return file_get_contents($jsonPath);
}
</code></pre>

<p>The JSON files are located at SITE_ROOT/assets/projects/json/</p>

<hr/>


<h2>PSP Portal</h2>

<p><a target="_blank" href="https://www.nbto.com/submissions">Submission Portal</a></p>
<p><strong>Please refer to supplied Word Document for all usernames/passwords</strong></p>

<h3>Setting Portal States</h3>

<p>Locate the file svn/SnbProject/release/core/Controller/Portal.php and choose between CLOSED, OPEN, REOPEN and LOCKED</p>
<img src="img/lock_state.JPG" />

<hr/>

<h3>Activate Night of Mobile Site</h3>

<p>file: svn/Mobile/release/core/Service/Redirect.php</p>
<p>line 22. comment out to disable mobile forwarding</p>

<pre><code>
if (!self::isMobileDomain() && !self::isDirty() && self::getDetect()->isMobile() && ($uri == "/")) {
	self::redirectToWeb();
	//self::redirectToMobile();
}
</code></pre>

<p>Remove this line from Chunk <strong>Mobile_Common_Head</strong></p>
<pre><code>&lt;meta http-equiv=&quot;refresh&quot; content=&quot;0; url=https://www.nbto.com/&quot; /&gt;</code></pre>

<p>Also in the mobile context <strong>Event Map</strong> page (ID 198), you need to check <strong>GPS</strong> in the template variable <strong>Web_Content_JS_Includes</strong>.</p>

<p><strong>NOTE:</strong> The mobile site also has some configurations (URLs, hosts, etc) in the <strong>MODX Manager -> Settings -> Contexts</strong> section. Right click on <strong>Mobile</strong> context and click <strong>Update Context</strong>. Flip over to the <strong>Context Settings</strong> tab and you will see all these settings listed here if you ever needed to change them.</p>

<hr/>


<h3>Files of Interest</h3>
	<p><strong>/svn/SnbProject/release/core/Snippet/Details.php</strong><br/>This gets project details info for lists and the project details page. Some hardcoded info here like Exhibition name and Curator. </p>
	<pre><code>
	protected $_zone_titles = array(
	    0 =&gt; '',
        1 =&gt; '&lt;span class=&quot;curator-title&quot;&gt;&lt;span class=&quot;red&quot;&gt;Militant Nostalgia&lt;/span&gt; curated by Paco Barrag&amp;aacute;n&lt;/span&gt;',
        2 =&gt; '&lt;span class=&quot;curator-title&quot;&gt;&lt;span class=&quot;red&quot;&gt;And the Transformation Reveals&lt;/span&gt; curated by Camille Hong Xin&lt;/span&gt;',
        3 =&gt; '&lt;span class=&quot;curator-title&quot;&gt;&lt;span class=&quot;red&quot;&gt;Facing the Sky&lt;/span&gt; curated by Louise D&amp;eacute;ry&lt;/span&gt;',
        4 =&gt; '&lt;span class=&quot;curator-title&quot;&gt;&lt;span class=&quot;red&quot;&gt;OBLIVION&lt;/span&gt; curated by Janine Marchessault and Michael Prokopow&lt;/span&gt;',
	);
	</code></pre>
	<img src="img/curator_titles.jpg" />
	<br/><br/>
	<p><strong>/svn/SnbProject/release/core/Model/Project.php</strong><br/>
	This is where fields appear for the artist portal. You can set max length and required values here as well as split it up for different types of projects. This is where you'll most likely do most of your edits. 
	</p>
	<pre><code>
	'contact_info_contact_first_name' =&gt; array(
        'maxlength' =&gt; 50,
        'required' =&gt; false,
        'type' =&gt; array(
            self::TYPE_INDEPENDENT =&gt; array(
                'required' =&gt; true,
            ),
            self::TYPE_MAJOR_INSTITUTIONS =&gt; array(
                'required' =&gt; true,
            )
        )
    ),
    </code></pre>
<hr/>


<h3>Changing The Year / Adding New Users</h3>
	<p>To set up the PSP to start a new year, there are a number of steps to complete. First you have to change the "Year" in the MODx manager System Settings.</p>
	<ol>
	<li>In the main navigation Dropdown, select <strong>Settings->System Settings</strong></li>
	<li>Filter the settings to only show ‘snbproject’
	<img src="img/change-year-system-setting-1.jpg" />
	</li>
	<li>Change the year to the correct year. 
		<img src="img/change-year-system-setting-2.jpg" /></li>
	<li>Connect to the Database via HeidiSQL or any similar program of your choice. Backup the database for safety.</li>
	<li>We will need to remove all of the artist info and the projects themselves from the database. Run these two scripts:<br/>
		<strong>TRUNCATE snb_staging.modx_snbproject_fields;</strong><br/>
		<strong>DELETE FROM snb_staging.modx_snbproject_projects WHERE year = PREVIOUS_YEAR;</strong>
		<img src="img/change-year-delete-users.jpg" />
	</li>
	</ol>
	<p>New users should be inserted into the <strong>modx_snbproject_projects</strong> table. There will be an Excel document provided by City of Toronto that list all the usernames needed and what category they belong to (Independent, Curated, etc). It is our task to create and provide the usernames with passwords and enter them into the database.</p>
	<ol>
	<li>Create passwords for each user. In the past we've used <a target='_blank' href="https://identitysafe.norton.com/password-generator/">Norton Password Generator</a> to generate the passwords. The settings we're set to 8 characters, with "Include Punctuation" checked off.</li>
	<li>Once you have generated the passwords needed and assigned them to the users in the Excel, we need to add them to the database. Ex: 
	<pre><code>INSERT INTO snb_staging.modx_snbproject_projects (`year`, type_id, zone_id, name, user_name, user_password, created_at) VALUES ('2015', 23, 1, 'Michael Snow','Msnow','ch5kEVeX', UNIX_TIMESTAMP());</code></pre>
	</li>


<hr/>

<h3>Assigning Project to Admin</h3>
	<p>One of the weird quirks about the PSP is when you need to assign the original approver and group to one of the NB admins. To do this, we need to change the <strong>assigned_user_id</strong> and <strong>assigned_group_id</strong> in the <strong>modx_snbproject_fields</strong> table.</p>
	<p>The problem is, the PSP doesn't reliably create these fields for every project. Sometimes these fields are missing. We have had to create them for a few projects on occasion. Watch out for this!</p>
	<p>After you are sure the fields exist, you can run an SQL statement to assign it to the NB staff and group (find the IDs in the Users table)</p>
	<pre><code>
	UPDATE modx_snbproject_fields SET value = {USER GROUP ID} WHERE name = assigned_group_id AND project_id = {PROJECT ID}
	UPDATE modx_snbproject_fields SET value = {USER ID} WHERE name = assigned_user_id AND project_id = {PROJECT ID}
	</code></pre>

<hr/>

<h3>Copy Edits</h3>
<p>To add some edits for deadlines on the portal, it should be done using lexicon section on MODX. </p>
<p><strong>Settings->Lexicons</strong>. Choose <strong>snbproject</strong> for the Namespace.</p>

<p>Edit any value you wish. You can change the <strong>Topic</strong> as well to get more results. After any change you must clear the MODX cache for changes to come into effect. <strong>Manage -> Clear Cache</strong>.</p>

<p>If you can't find the text you are looking for, they may be found in the actual lexicon folder in the code base:</p>
<ul>
	<li><strong>/var/www/www.scotiabanknuitblanche.ca/svn/SnbProject/release/core/lexicon/en</strong></li>
	<li><strong>/var/www/www.scotiabanknuitblanche.ca/svn/SnbShare/release/core/lexicon/en</strong></li>
	<li><strong>/var/www/www.scotiabanknuitblanche.ca/svn/Web/release/core/lexicon/en</strong></li>
</ul>

