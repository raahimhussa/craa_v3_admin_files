import compose from '@shopify/react-compose'
import SimulationsView from './SimulationsView'
import { withState } from '@hocs'
import withColumns from './withColumns'
import withLeftButtons from './withLeftButtons'
import withRightButtons from './withRightButtons'
import withSortBy from './withSortBy'; 

// import { useSortingContext } from 'src/contexts/SortingContext';

// const { setSortBy } = useSortingContext();

const getState = () => () => ({
  selectedRowIds: [], 
})

// const getState = (setSortBy: any) => () => ({
//   selectedRowIds: [],
//   onSortChange: (sortBy: any) => {

  
//     setSortBy(sortBy);

//     // console.log('Simulations Sort changed:', sortBy);
    
//   },  
// })

export default compose<any>(
  withState(getState),
  // withState(getState(setSortBy)),
  withColumns,
  withLeftButtons,
  withRightButtons,
  withSortBy
)(SimulationsView)

// const SimulationsPage = () => {
//   const { setSortBy } = useSortingContext();

//   const stateEnhancer = withState(getState(setSortBy));

// // const getState = () => () => ({
// //   selectedRowIds: [], 
// // })

//   const EnhancedSimulationsView = compose<any>(
//     stateEnhancer,
//     withState(getState),
//     withColumns,
//     withLeftButtons,
//     withRightButtons
//   )(SimulationsView);

//   return <EnhancedSimulationsView />;

// // return compose<any>(
// //   withState(getState),
// //   withColumns,
// //   withLeftButtons,
// //   withRightButtons
// // )(SimulationsView)  
// };

// export default SimulationsPage;
