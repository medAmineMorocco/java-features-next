import {useState} from "react";
import Head from 'next/head'
import {Layout, AutoComplete, Switch, Select, Card, Tag, Avatar, Image, Tooltip, Popover, Modal, Empty, Spin, Result} from 'antd';
import {TwitterOutlined, MediumOutlined, LinkOutlined, PictureOutlined} from '@ant-design/icons';
import {javaVersions, versionsColors, groupBy, stagesColors, stagesDefinitions, renderTitle, renderItem} from "../utils/data";
import {useQuery} from "react-query";
import Masonry from 'react-masonry-css';



export default function Home() {

    const [mode, setMode] = useState('VERSION');
    const [features, setFeatures] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState('all');
    const [options, setOptions] = useState([]);
    const [autocompleteOptions, setAutocompleteOptions] = useState(options);
    const [tipVisible, setTipVisible] = useState(false);
    const [tip, setTip] = useState();


    const { isLoading, isError, isSuccess, data } = useQuery('getFeatures', () => {
        return fetch(process.env.NEXT_PUBLIC_API_URL)
            .then((resp) => resp.json());
    }, {
        onSuccess: (data) => {
            setFeatures(data);
            setOptions(Object.entries(groupBy(data, 'version')).map(([key, value]) => {
                return {
                    'label': renderTitle('Java ' + key),
                    'options': value.map(({title}) => renderItem(title))
                }
            }));
        }
    });

    function handleSwitchChange(value) {
        if (value) {
            setMode('VERSION');
            filterFeaturesByVersion(selectedVersion);
        } else {
            setMode('FEATURE');
            setFeatures(data);
        }
    }

    function handleChange(value) {
        filterFeaturesByVersion(value);
    }

    function onSelectVersion(newVersion) {
        setSelectedVersion(newVersion);
    }

    function handleSelect(feature) {
        setFeatures(data.filter(({title}) => title === feature));
    }

    function handleSearch(value) {
        if (value === '') {
            setAutocompleteOptions(options);
            setFeatures(data);
        } else {
            setAutocompleteOptions(options.filter(({options}) => options.map(option => option.value.toLowerCase()).find(val => val.includes(value.toLowerCase()))));
        }
    }

    function handleFocus() {
        setAutocompleteOptions(options);
    }

    function filterFeaturesByVersion(byVersion) {
        if (byVersion === 'all') {
            setFeatures(data);
        } else {
            setFeatures(data.filter(({version}) => version === byVersion));
        }
    }

    function handleTipVisible(link) {
        setTipVisible(true);
        setTip(link);
    }

    var content;

    if (isLoading) {
        content = <Spin />;
    }

    if (isError) {
        content = <Result subTitle="Sorry, something went wrong." />;
    }

    if (isSuccess) {
        content = features.length === 0
            ?
            <Empty image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
                   imageStyle={{
                       fontsize: 60,
                   }}/>
            :
            features.map(({title, description, version, stage, link, tipLink}) =>
                <div className='col' key={title}>
                    <Card title={title}
                          bordered={false}
                          extra={<>
                              {stage && <Popover placement='bottom' color={stagesColors[stage]} overlayClassName="stage-popover" content={stagesDefinitions[stage]} trigger="click"><Tag color={stagesColors[stage]} className="stage-tag">{stage}</Tag></Popover>}
                              <Tag color={versionsColors[version]}>Java {version}</Tag>
                          </>}
                          actions={[
                              ...tipLink ? [<Tooltip title="Explanation" key={0}><PictureOutlined onClick={() => handleTipVisible(tipLink)}/></Tooltip>] : [],
                              <Tooltip title="Official Documentation" key={1}><a href={link} target="_blank" rel="noreferrer"><LinkOutlined /></a></Tooltip>,
                          ]}
                          bodyStyle={{height: 'fit-content', padding: '12px', fontFamily: 'Verdana', fontsize: '16px', textAlign: 'left'}}
                    >
                        {description}
                    </Card>
                </div>);
    }

    return (
        <Layout>
            <Head>
                <title>Java Features</title>
                <meta name ="title" content ="java features"/>
                <meta name ="description" content ="website to show the new features of java 9 and above"/>
                <meta name ="copyright" content ="medamine"/>
                <meta name ="keywords" content ="java,java17,java15,java9,java11"/>
                <meta property ="og:type" content ="website"/>
                <meta property ="og:url" content ="https://java-features.netlify.app"/>
                <meta property ="og:title" content ="java features"/>
                <meta property ="og:description" content ="website to show the new features that appeared on the last java versions since version 8"/>
                <meta property ="og:image" content ="https://user-images.githubusercontent.com/12902041/148128600-a78ccc25-db03-44d7-98ca-49c11c7d4c30.png"/>
                <meta property ="twitter:card" content ="summary_large_image"/>
                <meta property ="twitter:url" content ="https://java-features.netlify.app"/>
                <meta property ="twitter:title" content ="java features"/>
                <meta property ="twitter:description" content ="website to show the new features that appeared on the last java versions since version 8"/>
                <meta property ="twitter:image" content ="https://user-images.githubusercontent.com/12902041/148128600-a78ccc25-db03-44d7-98ca-49c11c7d4c30.png"/>

                <link rel="icon" href="/favicon.ico" />
                <script async src="https://cdn.splitbee.io/sb.js"></script>
            </Head>
            <Layout.Header className="header">
                <div className="header-navigation">
                    <Avatar
                        draggable={false}
                        src={
                            <Image
                                src="https://joeschmoe.io/api/v1/random"
                                style={{
                                    width: 32,
                                }}
                            />
                        }
                    />
                    <div className="social-icons-container">
                        <a href="https://twitter.com/ItLabs1" target="_blank" rel="noreferrer">
                            <TwitterOutlined className="twitter-icon"/>
                        </a>
                        <a href="https://medium.com/@mohamedamineammach" target="_blank" rel="noreferrer">
                            <MediumOutlined className="medium-icon"/>
                        </a>
                    </div>
                </div>
            </Layout.Header>

            <Layout.Content className="main-content">
                <div className="search-container">
                    <AutoComplete
                        allowClear={true}
                        disabled={mode === 'VERSION'}
                        dropdownMatchSelectWidth={true}
                        style={{width: 250}}
                        options={autocompleteOptions}
                        placeholder='Example: Var'
                        onSelect={handleSelect}
                        onSearch={handleSearch}
                        onFocus={handleFocus}
                    >
                    </AutoComplete>

                    <Switch className="switch-mode" onChange={handleSwitchChange} checkedChildren="By Version"
                            unCheckedChildren="By Feature" defaultChecked/>

                    <Select disabled={mode === 'FEATURE'} value={selectedVersion} onSelect={onSelectVersion} style={{width: 250}}
                            onChange={handleChange}>
                        <Select.Option value='all'>All</Select.Option>
                        {javaVersions.map(javaVersion => <Select.Option
                            value={javaVersion} key={javaVersion}>Java {javaVersion}</Select.Option>)}
                    </Select>
                </div>

                <Masonry
                    breakpointCols={{
                        default: 4,
                        1199: 3,
                        1024: 2,
                        575: 1
                    }}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                    {...((features.length ===0 || isLoading) && {style: {height: '90%', justifyContent: 'center', alignItems: 'center'}})}>
                    {content}
                </Masonry>

                <Modal
                    centered
                    visible={tipVisible}
                    onCancel={() => setTipVisible(false)}
                    footer={null}
                    title={null}
                    closable={false}
                    bodyStyle={{padding: 0}}
                >
                    <div className='tip-container'>
                        <Image src={tip} />
                    </div>
                </Modal>
            </Layout.Content>

            <Layout.Footer className='footer'>
                <h3 style={{color: 'white'}}>Join My Newsletter</h3>
                <div id="revue-embed">
                    <form action="https://www.getrevue.co/profile/itlabs1/add_subscriber" method="post" id="revue-form"
                          name="revue-form" target="_blank">
                        <div className="revue-form-group">
                            <input className="revue-form-field" placeholder="Email address" type="email"
                                   name="member[email]" id="member_email"/>
                            <input type="submit" value="Subscribe" name="member[subscribe]" id="member_submit"/>
                        </div>
                        <div className="revue-form-actions">

                        </div>
                        <div className="revue-form-footer">By subscribing, you agree with Revue???s <a target="_blank"
                                                                                                     rel="noreferrer"
                                                                                                     href="https://www.getrevue.co/terms">Terms
                            of Service</a> and <a target="_blank" rel="noreferrer"  href="https://www.getrevue.co/privacy">Privacy
                            Policy</a>.
                        </div>
                    </form>
                </div>
            </Layout.Footer>

        </Layout>
    );
}
