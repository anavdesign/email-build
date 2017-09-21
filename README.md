# Email Template

1. Install packages ``npm i``
2. Clone campaigns **/_templates**
    ```
    $ cp campaigns/_template campaigns/folder_name
    ```

3. Change directory variable in **app/gulp.js**
    ```
    dir = folder_name
    ```

4. ``run gulp``
5. Final email will be created in **campaigns/dist** directory
6. Preview email at <http://localhost:3030/email-name.html>
