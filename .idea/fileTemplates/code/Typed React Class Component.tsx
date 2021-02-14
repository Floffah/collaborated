export interface ${NAME}Props {
    #if($PROP_TYPES) $PROP_TYPES#end
}

interface ${NAME}State {
    #if($STATE_TYPES) $STATE_TYPES#end
}

export class ${NAME} extends Component<${NAME}Props, ${NAME}State> {
  #if($DEFAULT_PROPS)
    static defaultProps = $DEFAULT_PROPS
  #end
  render() {
    return $COMPONENT_BODY
  }
}