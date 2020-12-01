interface $!NAMEProps {
    #if($PROP_TYPES) $PROP_TYPES#end
}

interface $!NAMEState {

}

class $!NAME extends Component<$!NAMEProps, $!NAMEState> {
  #if($DEFAULT_PROPS)
    static defaultProps = $DEFAULT_PROPS
  #end
  render() {
    return $COMPONENT_BODY
  }
}