### Demo

<a href="http://asduser.github.io/examples/form-validator/index.html" target="_blank"><b>Open demo page</b></a>

### Description

Angular.js directive to manage HTML-forms (validate fields) by the following types:
<ul>
<li> email </li>
<li> phone </li>
<li> password </li>
<li> text </li>
</ul>

As a result you may specify a special handlers when form will be passed with success.

### How does it work

Inject into your project files from <b>dist</b> directory.
Thereafter put a <b><form-validator></form-validator></b> directive where you want to display the error messages.
To see sample description use <i>example.js</i> and <i>example.html</i> files.

<ol>
<li> Each element have to have "id" attribute. </li>
<li> Following input types are: "text", "email" and "password". </li>
<li> To invoke the validation procedure just specify an appropriate button as a functional. </li>
<li> When validation was successfuly completed, you may set up a handle function to continue. </li>
</ol>

### Configuring

Use a following attributes inside <b><form-validator></b> directive to manage the form fields:

```javascript
    // Password length. If less - field won't be a valid. Type: number. Default value: 6.
    "password-length": 3
    // Show\hide interactive errors on UI. Type: boolean. Default value: false.
    "display-errors": true
    // Emails #ids collection to compare. See example for details. Type: array of strings.
    "email": []
    // Phones #ids collection which will be used for validation. See example for details. Type: array of strings.
    "phone": []
    // Passwords #ids collection to compare (length, equal, empty). See example for details. Type: array of strings.
    "compare-password": []
    // Additional #ids collection to validate "null" fields. See example for details. Type: array of strings.
    "set": []
    // Positive border color. Type: string. Defaul value: "1px solid #ccc".
    "default-border": "3px solid #ff4400"
    // Negative border color. Type: string. Defaul value: "2px solid #aa0000".
    "danger-border": "3px solid #ff4400"
    // #id or .class element which will manage current behaviour. Type: string.
    "element": "some-element-id"
    // Procedure which will be invoked through directive scope (if validation result is successful). Type: function.
    "handler": "test" 
```

See <i>example.html</i> and <i>example.js</i> for details.
