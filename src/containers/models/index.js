import { connect } from 'react-redux'
import Models from '../../components/models';

function mapStateToProps(state) {
    return {
        items: state.models.items
    }
}

export default connect(mapStateToProps)(Models)
