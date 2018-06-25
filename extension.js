const vscode = require('vscode');

function activate(context)
{

    let disposable = vscode.commands.registerCommand('extension.generateGetterAndSetters', function ()
    {
        var editor = vscode.window.activeTextEditor;
        if (!editor)
            return; // No open text editor

        var selection = editor.selection;
        var text = editor.document.getText(selection);

        if (text.length < 1)
        {
            vscode.window.showErrorMessage('No selected properties.');
            return;
        }

        try
        {
            var getterAndSetter = createGetterAndSetter(text);

            editor.edit(
                edit => editor.selections.forEach(
                  selection =>
                  {
                    edit.insert(selection.end, getterAndSetter);
                  }
                )
              );
        }
        catch (error)
        {
            console.log(error);
            vscode.window.showErrorMessage('Something went wrong! Try that the properties are in this format: "private String name;"');
        }
    });

    context.subscriptions.push(disposable);
}

function toPascalCase(str)
{
    return str.replace(/\w+/g,w => w[0].toUpperCase() + w.slice(1));
}

function createGetterAndSetter(textProperties)
{
    var properties = textProperties.split(/[\r\n]+/);


//     properties.filter(x => x.length > 2).map(x => x.replace(';', ''));
// console.log(properties);
    var generatedCode = `
`;
    for (let p of properties)
    {
        let prop = p.match(/\w{0,}\$(\w{0,})\;/);
        let type, attribute, Attribute = "";
        let create = false;

        if (prop.length) {
            attribute = prop[1];
            Attribute = toPascalCase(prop[1]);
            create = true;
        }

        if (create) {

            let code =
`
\tpublic function get${Attribute}()
\t{
\t\treturn \$this->${attribute};
\t}

\tpublic function set${Attribute}(\$${attribute})
\t{
\t\t\$this->${attribute} = \$${attribute};
\t\treturn \$this;
\t}
`;
            generatedCode += code;
        }
    }

    return generatedCode;
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

exports.deactivate = deactivate;
