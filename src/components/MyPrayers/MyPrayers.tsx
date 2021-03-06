import {PlusIcon} from '@assets/images/svg/PlusIcon';
import React, {useMemo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import {Form, Field} from 'react-final-form';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PrayerPreview} from '@components/PrayerPreview';
import {Button, Loader} from '@components/ui';
import {useAppDispatch, useAppSelector} from '@lib/hooks';
import {createPrayer} from '@store/sagas';
import {ColumnData, PrayerData} from '@lib/interfaces';

interface MyPrayersProps {
  column: ColumnData;
  onNavigate(prayer: PrayerData): void;
}

const MyPrayers: React.FC<MyPrayersProps> = ({column, onNavigate}) => {
  const [isHide, setIsHide] = useState(false);
  const dispatch = useAppDispatch();
  const prayers = useAppSelector(state => state.prayers);
  const {isLoading} = useAppSelector(state => state.loader);

  const columnPrayers = useMemo(
    () => prayers.list.filter(item => column.id === item.columnId),
    [prayers.list, column.id],
  );

  const onCreatePrayer = (title: string) => {
    if (title.trim()) {
      dispatch(
        createPrayer({
          title: title,
          checked: false,
          description: '',
          columnId: column.id,
        }),
      );
    }
  };

  return (
    <SafeAreaView style={styles.body}>
      {isLoading && <Loader />}
      <View style={styles.container}>
        <Form
          onSubmit={value => {
            onCreatePrayer(value.title);
          }}
          initialValues={{title: ''}}
          render={({form}) => (
            <View style={styles.prayerForm}>
              <TouchableOpacity
                style={styles.inputButton}
                onPress={() => {
                  form.submit();
                  form.reset();
                }}>
                <PlusIcon />
              </TouchableOpacity>

              <Field name="title">
                {({input}) => (
                  <TextInput
                    style={styles.prayerInput}
                    placeholder="Add a prayer..."
                    onChangeText={input.onChange}
                    onSubmitEditing={() => {
                      form.submit();
                      form.reset();
                    }}
                    value={input.value}
                    placeholderTextColor="#9C9C9C"
                    selectionColor="#72A8BC"
                  />
                )}
              </Field>
            </View>
          )}
        />

        <FlatList
          data={columnPrayers.filter(item => !item.checked)}
          removeClippedSubviews={false}
          ListHeaderComponent={
            <View style={styles.prayerList}>
              <FlatList
                data={columnPrayers.filter(item => !item.checked)}
                removeClippedSubviews={false}
                renderItem={({item}) => (
                  <PrayerPreview
                    key={item.id}
                    prayer={item}
                    onPress={() => onNavigate(item)}
                  />
                )}
              />
            </View>
          }
          ListFooterComponent={
            <View style={styles.answered}>
              {isHide ? (
                <View style={styles.answeredButton}>
                  <Button onPress={() => setIsHide(!isHide)}>
                    SHOW ANSWERED PRAYERS
                  </Button>
                </View>
              ) : (
                <>
                  <View style={styles.answeredButton}>
                    <Button onPress={() => setIsHide(!isHide)}>
                      HIDE ANSWERED PRAYERS
                    </Button>
                  </View>
                  <View style={styles.answeredLine} />
                  <View style={styles.prayerList}>
                    <FlatList
                      data={columnPrayers.filter(item => item.checked)}
                      removeClippedSubviews={false}
                      renderItem={({item}) => (
                        <PrayerPreview
                          key={item.id}
                          prayer={item}
                          onPress={() => onNavigate(item)}
                        />
                      )}
                    />
                  </View>
                </>
              )}
            </View>
          }
          renderItem={() => <></>}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  prayerInput: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'SFUIText-Regular',
  },
  prayerForm: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'rgb(229, 229, 229)',
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 16,
  },
  inputButton: {
    paddingHorizontal: 14,
  },
  prayerList: {
    width: '100%',
  },
  answered: {
    width: '100%',
  },
  answeredButton: {
    paddingVertical: 21,
  },
  answeredLine: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    marginHorizontal: 15,
  },
});

export default MyPrayers;
