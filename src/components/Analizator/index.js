import {connect} from "react-redux";
import PropTypes from 'prop-types'
import * as React from "react";
import {Divider, Header, Icon, Button, Image, TextArea, Modal, Label} from "semantic-ui-react";
import Token from "../Token";
import {toggleShowInfo, setSortBy, setText, setTokens} from "../../actions";
import analyzeText from "../../helpers/analyzer";
import styles from "../Container/styles.css"


const Analizator = ({
                        text,
                        sortBy,
                        tokens,
                        toggleShowInfo,
                        showInfo,
                        setText,
                        setTokens,
                        setSortBy
                    }) => {

    const mockData = `Слободяник Максим, 

Маю 29 років!
Народився: 27/09/2020.


Особиста пошта:       madianyk@gmailcom;
Корпоративна пошта:       ma.dianyk@ukma.edu.ua;


Особистий номер: 077-345-15-65.
`

    const getContent = () => {
        if (tokens.length !== 0) {
            if (sortBy) {
                return tokens.filter(token => token.type === sortBy).map(token => (
                        <Token token={token}  setSortBy={setSortBy}/>
                    )
                )
            }
            return tokens.map(token => (
                    <Token token={token} setSortBy={setSortBy}/>
                )
            )
        }
        return <p className={'no-items'}>Лексеми відсутні</p>
    }

    return (
        <div>
            <div className={'container'}>
                <TextArea className={'text-area'}
                          placeholder='Вставте текст українською мовою для аналізу...'
                          style={{minHeight: 400}}
                          value={text}
                          onInput={e => {
                              const enteredText = e.target.value
                              if (enteredText.length <= 4000) {
                                  setTokens(analyzeText(enteredText));
                              }
                              setText(enteredText)
                          }}
                />
                {text.length > 4000 &&
                <p className={'analyze-alert'}>Довжина тексту більше 4000 символів, щоб проаналізувати натисніть
                    кнопку "Проаналізувати"</p>}
                <div className={'buttons-container'}>
                    {text.length === 0 &&
                    <div style={{
                        color: '#AEB5BF',
                        alignSelf: 'center',
                        cursor: 'pointer',
                        marginRight: '30px'
                    }} onClick={() => {
                        setText(mockData);
                        setTokens(analyzeText(mockData));
                    }}>Натисніть, щоб вставити тестовий текст</div>
                    }
                    <Button className={'content-button'} content={'Очистити'}
                            onClick={() => {
                                setText('');
                                setTokens([]);
                            }}/>
                    <Button content={'Проаналізувати'} color='green'
                            onClick={() => setTokens(analyzeText(text))}/>

                </div>
            </div>
            <Divider horizontal>
                <Header as='h4'>
                    <Icon name='tag'/>
                    Лексеми
                </Header>
            </Divider>
            <div className={'tag-container'}>
                <div className={'sort-tag'} style={sortBy ? {} : {borderBottomStyle: 'solid'}}>
                    <Label as='a' tag onClick={() => setSortBy(undefined)}>
                        Всі
                    </Label>
                </div>
                <div className={'sort-tag'} style={sortBy === 'valid' ? {borderBottomStyle: 'solid'} : {}}>
                    <Label as='a' color='green' tag onClick={() => setSortBy('valid')}>
                        Валідні
                    </Label>
                </div>
                <div className={'sort-tag'} style={sortBy === 'date' ? {borderBottomStyle: 'solid'} : {}}>
                    <Label as='a' color='blue' tag onClick={() => setSortBy('date')}>
                        Дата
                    </Label></div>
                <div className={'sort-tag'} style={sortBy === 'email' ? {borderBottomStyle: 'solid'} : {}}>
                    <Label as='a' color='yellow' tag onClick={() => setSortBy('email')}>
                        E-mail
                    </Label></div>
                <div className={'sort-tag'} style={sortBy === 'tel' ? {borderBottomStyle: 'solid'} : {}}>
                    <Label as='a' color='pink' tag onClick={() => setSortBy('tel')}>
                        Номер телефону
                    </Label></div>
                <div className={'sort-tag'} style={sortBy === 'numeric' ? {borderBottomStyle: 'solid'} : {}}>
                    <Label as='a' color='orange' tag onClick={() => setSortBy('numeric')}>
                        Число
                    </Label></div>
                <div className={'sort-tag'} style={sortBy === 'separator' ? {borderBottomStyle: 'solid'} : {}}>
                    <Label as='a' color='violet' tag onClick={() => setSortBy('separator')}>
                        Роздільник
                    </Label>
                </div>
                <div className={'sort-tag'} style={sortBy === 'invalid' ? {borderBottomStyle: 'solid'} : {}}>
                    <Label as='a' color='red' tag onClick={() => setSortBy('invalid')}>
                        Не валідні
                    </Label>
                </div>
            </div>
            <div className={'container'}>
                {getContent()}
            </div>
        </div>
    )
}

Analizator.propTypes = {
    showInfo: PropTypes.bool.isRequired,
    tokens: PropTypes.array.isRequired,
    text: PropTypes.string.isRequired,
    sortBy: PropTypes.string
}

const mapStateToProps = state => ({
    state: state,
    showInfo: state.analyzerReducer.showInfo,
    tokens: state.analyzerReducer.tokens,
    text: state.analyzerReducer.text,
    sortBy: state.analyzerReducer.sortBy,
})

const mapDispatchToProps = dispatch => ({
    setText: text => dispatch(setText(text)),
    toggleShowInfo: () => dispatch(toggleShowInfo()),
    setTokens: tokens => dispatch(setTokens(tokens)),
    setSortBy: sortBy => dispatch(setSortBy(sortBy))
})

export default connect(mapStateToProps, mapDispatchToProps)(Analizator)
