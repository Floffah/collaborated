import * as React from "react";

export interface ${NAME}Props {
    #if($PROP_TYPES != "") $PROP_TYPES#end
}

interface ${NAME}State {
    #if($STATE_TYPES != "") $STATE_TYPES#end
}

export class ${NAME} extends React.Component<${NAME}Props, ${NAME}State> {
  #if($DEFAULT_PROPS != "")
    static defaultProps = $DEFAULT_PROPS
  #end
  render() {
    return #if($COMPONENT_BODY != "") $COMPONENT_BODY #else null #end
  }
}