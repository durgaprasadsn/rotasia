import { Preferences } from '@capacitor/preferences';

const setAuthenticated = async (val) => {
  await Preferences.set({
    key: 'authenticated',
    value: val,
  });
};

const checkAuthenticated = async () => {
  const { value } = await Preferences.get({ key: 'authenticated' });

  console.log(`Hello ${value}!`);
  return value;
};

export { setAuthenticated, checkAuthenticated };