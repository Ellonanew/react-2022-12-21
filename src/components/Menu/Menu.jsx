import { Dish } from '../Dish/Dish';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectRestaurantMenuById,
  selectRestaurantMenuByIdSortedByDishName,
} from '../../store/modules/restaurant/selectors';
import { useEffect, useLayoutEffect } from 'react';
import { selectIsDishLoading } from '../../store/modules/dish/selectors';
import { fetchDishByRestaurantId } from '../../store/modules/dish/thunks/fetchDishByRestaurantId';
import { Button } from '../Button/Button';
import { useParams, useSearchParams } from 'react-router-dom';
import { getAlternativeSort } from './utils';
import { sortDirections } from '../../constants/sortDirections';
import { useRef } from 'react';
import { useCallback } from 'react';
import { withAuthorization } from '../../hocs/withAuthorization/withAuthorization';

const sortSearchParamName = 'sort';
const defaultSort = { [sortSearchParamName]: sortDirections.asc };

export const Menu = () => {
  // const listRef = useRef();
  // const timerRef = useRef();
  const { restaurantId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams(defaultSort);
  const dispatch = useDispatch();
  const currentSort = searchParams.get(sortSearchParamName);

  const dishIds = useSelector((state) =>
    selectRestaurantMenuByIdSortedByDishName(state, {
      restaurantId,
      sortDirection: currentSort,
    })
  );
  const isLoading = useSelector(selectIsDishLoading);

  useEffect(() => {
    dispatch(fetchDishByRestaurantId(restaurantId));
  }, [restaurantId]);

  // useLayoutEffect(() => {
  //   if (listRef.current) {
  //     listRef.current.addEventListener();
  //   }
  // }, []);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <div>
      <h2>Menu</h2>
      <Button
        onClick={() => {
          setSearchParams({
            sort: getAlternativeSort(currentSort),
          });
        }}
      >
        Toggle sort (current: {currentSort})
      </Button>
      <div>
        {dishIds.map((id) => (
          <Dish key={id} dishId={id} />
        ))}
      </div>
    </div>
  );
};

export const MenuWithAuthorizedCheck = withAuthorization(Menu);
