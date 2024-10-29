import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Image } from 'expo-image';
import { observer } from 'mobx-react-lite';
import React, { Ref } from 'react';
import { StyleSheet, Linking, Text, Dimensions, Platform } from 'react-native';
import Colors from '../Colors';
import useConfig from '../hooks/useConfig';
import useStores from '../hooks/useStores';
import InfoMenuButton from './InfoMenuButton';

const InfoMenuBottomSheet = observer(
  React.forwardRef((_, ref) => {
    const { infoMenuStore, playerStore } = useStores();

    const { configBase, configStrings } = useConfig();

    return (
      <BottomSheet
        index={-1}
        snapPoints={['90%']}
        ref={ref as Ref<BottomSheetMethods>}
        backgroundStyle={{ backgroundColor: Colors.dwgBackgroundColor }}
        animateOnMount={false}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={BottomSheetBackdrop}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.container}
          style={{
            maxHeight: Dimensions.get('window').height,
          }}
        >
          <Text style={styles.sectionTitle}>
            {infoMenuStore.channelInfo.title}
          </Text>
          <Text style={styles.infoString}>
            {infoMenuStore.channelInfo.infoString}
          </Text>
          {configBase.additionalInfosLinks[playerStore.selectedChannel].length >
            0 && (
            <Text style={styles.sectionTitle}>
              {configStrings.additionalLinks}
            </Text>
          )}
          {configBase.additionalInfosLinks[playerStore.selectedChannel].map(
            (button) => {
              if (!button.url) return null;
              return (
                <InfoMenuButton
                  key={`button_${button.name}`}
                  iconName={
                    Platform.OS === 'android'
                      ? button.iconAndroid ?? button.icon
                      : button.icon
                  }
                  title={button.name}
                  onPress={() =>
                    Linking.openURL(
                      Platform.OS === 'android'
                        ? button.urlAndroid ?? button.url
                        : button.url
                    )
                  }
                />
              );
            }
          )}
          {configBase.contactMail.length ? (
            <>
              <Text style={styles.sectionTitle}>{configStrings.contact}</Text>
              <InfoMenuButton
                iconName="mail-outline"
                title={configStrings.mailButton}
                onPress={() => {
                  Linking.openURL(`mailto:${configBase.contactMail}`);
                }}
              />
              {configBase.additionalContactLinks.map((link, index) => (
                <InfoMenuButton
                  key={`link_${index}`}
                  iconName={link.icon}
                  title={link.name}
                  onPress={() => {
                    Linking.openURL(link.url);
                  }}
                />
              ))}
            </>
          ) : null}

          {configBase.urlBankTransfer.length || configBase.urlPaypal.length ? (
            <Text style={styles.sectionTitle}>{configStrings.donation}</Text>
          ) : null}
          {configBase.urlBankTransfer.length ? (
            <InfoMenuButton
              iconName="card-outline"
              title={configStrings.bankTransfer}
              onPress={() => {
                Linking.openURL(configBase.urlBankTransfer);
              }}
            />
          ) : null}
          {configBase.urlPaypal.length ? (
            <InfoMenuButton
              title={configStrings.paypal}
              onPress={() => {
                Linking.openURL(configBase.urlPaypal);
              }}
              component={
                <Image
                  style={{ flex: 1, height: 20 }}
                  source={require('../../assets/paypalLogo.png')}
                  contentFit="contain"
                />
              }
            />
          ) : null}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  })
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.dwgBackgroundColor,
    gap: 10,
    paddingBottom: 50,
  },
  sectionTitle: {
    fontSize: 15,
    color: Colors.dwgDarkColor,
    fontWeight: 'bold',
  },
  infoString: {
    fontSize: 15,
    color: Colors.dwgDarkColor,
  },
});

export default InfoMenuBottomSheet;
