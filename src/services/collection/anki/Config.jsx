import { INSTANCE_NAME_CONFIG_KEY } from '../../../utils/service_instance';
import { Button, Input } from '@nextui-org/react';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { open } from '@tauri-apps/api/shell';
import React, { useState } from 'react';

import { useConfig } from '../../../hooks';
import { useToastStyle } from '../../../hooks';
import { collection } from './index';

export function Config(props) {
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const { instanceKey, updateServiceList, onClose } = props;
    const [ankiConfig, setAnkiConfig] = useConfig(
        instanceKey,
        {
            [INSTANCE_NAME_CONFIG_KEY]: t('services.collection.anki.title'),
            port: 8765,
        },
        { sync: false }
    );

    const toastStyle = useToastStyle();

    return (
        ankiConfig !== null && (
            <>
                <Toaster />
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setIsLoading(true);
                        collection('test', '测试', { config: ankiConfig }).then(
                            () => {
                                setIsLoading(false);
                                setAnkiConfig(ankiConfig, true);
                                updateServiceList(instanceKey);
                                onClose();
                            },
                            (e) => {
                                setIsLoading(false);
                                toast.error(t('config.service.test_failed') + e.toString(), { style: toastStyle });
                            }
                        );
                    }}
                >
                    <div className='config-item'>
                        <Input
                            label={t('services.instance_name')}
                            labelPlacement='outside-left'
                            value={ankiConfig[INSTANCE_NAME_CONFIG_KEY]}
                            variant='bordered'
                            classNames={{
                                base: 'justify-between',
                                label: 'text-[length:--nextui-font-size-medium]',
                                mainWrapper: 'max-w-[50%]',
                            }}
                            onValueChange={(value) => {
                                setAnkiConfig({
                                    ...ankiConfig,
                                    [INSTANCE_NAME_CONFIG_KEY]: value,
                                });
                            }}
                        />
                    </div>
                    <div className={'config-item'}>
                        <h3 className='my-auto'>{t('services.help')}</h3>
                        <Button
                            onPress={() => {
                                open('https://pot-app.com/docs/api/collection/anki.html');
                            }}
                        >
                            {t('services.help')}
                        </Button>
                    </div>
                    <div className={'config-item'}>
                        <Input
                            label={t('services.collection.anki.port')}
                            labelPlacement='outside-left'
                            value={ankiConfig['port']}
                            type='number'
                            variant='bordered'
                            classNames={{
                                base: 'justify-between',
                                label: 'text-[length:--nextui-font-size-medium]',
                                mainWrapper: 'max-w-[50%]',
                            }}
                            onValueChange={(value) => {
                                setAnkiConfig({
                                    ...ankiConfig,
                                    port: value,
                                });
                            }}
                        />
                    </div>
                    <Button
                        type='submit'
                        isLoading={isLoading}
                        fullWidth
                        color='primary'
                    >
                        {t('common.save')}
                    </Button>
                </form>
            </>
        )
    );
}
