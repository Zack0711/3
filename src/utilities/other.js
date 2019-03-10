import _ from 'lodash'

export const hasClass = (element, className) => element.getAttribute('class').indexOf(className) > -1

export const addClass = (element, className) => {
  const classNameList = _.union(element.getAttribute('class').split(' '), className)
  element.setAttribute('class', classNameList.join(' '))
}

export const removeClass = (element, className) => {
  const classNameList = _.difference(element.getAttribute('class').split(' '), className)
  element.setAttribute('class', classNameList.join(' '))
}

export const toggleClass = (element, className) => {
  if(hasClass(element, className)){
    removeClass(element, [className])    
  }else{
    addClass(element, [className])
  }
}

export const defaultTranslate = (setting = {}) => {
  return key => setting[key] ? setting[key] : key
}

export const collectDataAttribute = (element) => {
  const elementAttr = element.attributes
  const attrData = {}
  _.forEach(elementAttr, (attr) => {
    if(attr.name.indexOf('data-') > -1){ 
      const attrName = attr.name.replace('data-', '').split('-').map((d, i) => i ? d.replace(d[0], d[0].toUpperCase()) : d ).join('')
      attrData[attrName] = attr.value
    }
  })
  return  attrData
}

export const isHumanClick = e => e.isTrusted || (e.screenX && e.screenY)

export const getSVGString = svgNode => {
  const serializer = new XMLSerializer();
  let svgString = ''
  svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
  svgString = new XMLSerializer().serializeToString(svgNode);
  svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
  svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix
  return svgString;
}
