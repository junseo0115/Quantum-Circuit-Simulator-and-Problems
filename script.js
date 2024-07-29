const gates = document.querySelectorAll('.outCircuit');
const circuits = document.querySelectorAll('.circuit');
const inCircuitGates = [[],[],[],[]];

gates.forEach(gate => {
  gate.addEventListener('mousedown', function(e) {
    const gateElement = this;
    const originalX = gateElement.getBoundingClientRect().left;
    const originalY = gateElement.getBoundingClientRect().top;
    const offsetX = e.clientX - gateElement.getBoundingClientRect().left;
    const offsetY = e.clientY - gateElement.getBoundingClientRect().top;

    function moveBox(e) {
      gateElement.style.left = `${e.clientX - offsetX}px`;
      gateElement.style.top = `${e.clientY - offsetY}px`;
      const gateRect = gateElement.getBoundingClientRect();
      
      for (let i=0; i<circuits.length; i++) {
        if (gateRect.left < circuits[i].getBoundingClientRect().right &&
            gateRect.right > circuits[i].getBoundingClientRect().left &&
            gateRect.top < circuits[i].getBoundingClientRect().bottom &&
            gateRect.bottom > circuits[i].getBoundingClientRect().top) {
          circuits[i].style.background = 'red';
        } else {
          circuits[i].style.background = '#333';
        }
      }
    }







    function addGate(circuitIndex, gate) {
      if (gate.classList.contains('doubleGate') && circuitIndex < circuits.length - 1) {
        circuits[circuitIndex].style.background = '#333';
        circuits[circuitIndex+1].style.background = '#333'
        while (inCircuitGates[circuitIndex].length !== inCircuitGates[circuitIndex + 1].length) {
          if (inCircuitGates[circuitIndex].length < inCircuitGates[circuitIndex + 1].length) {
            inCircuitGates[circuitIndex].push('I');
          } else {
            inCircuitGates[circuitIndex + 1].push('I');
          }
        }
        const newGate1 = document.createElement('div');
        newGate1.classList.add('gate', 'inCircuit');
        newGate1.style.left = `${75 * inCircuitGates[circuitIndex].length}px`;
        const gatename1 = document.createTextNode(gate.innerHTML);
        newGate1.append(gatename1);
        circuits[circuitIndex].appendChild(newGate1);
   
        const newGate2 = document.createElement('div');
        newGate2.classList.add('gate', 'inCircuit');
        newGate2.style.left = `${75 * inCircuitGates[circuitIndex].length}px`;
        const gatename2 = document.createTextNode(gate.innerHTML);
        newGate2.append(gatename2);
        circuits[circuitIndex+1].appendChild(newGate2);

        const gateLine = document.createElement('div');
        gateLine.classList.add('gateLine');
        gateLine.style.left = `${75 * inCircuitGates[circuitIndex].length+30}px`;
        gateLine.style.top = `${0}px`;
        circuits[circuitIndex].appendChild(gateLine);


        inCircuitGates[circuitIndex].push(gate.innerHTML);
        inCircuitGates[circuitIndex+1].push('II');
        const statevector = calcStateVector();
        plotHistogram(statevector);
        plotStatevector(statevector);




      } else if ( !gate.classList.contains('doubleGate')) {
        circuits[circuitIndex].style.background = '#333';
        const newGate = document.createElement('div');
        newGate.classList.add('gate', 'inCircuit');
        newGate.style.left = `${75 * inCircuitGates[circuitIndex].length}px`;
        const gatename = document.createTextNode(gate.innerHTML);
        newGate.append(gatename);
        circuits[circuitIndex].appendChild(newGate);
        inCircuitGates[circuitIndex].push(gate.innerHTML);
        const statevector = calcStateVector();
        plotHistogram(statevector);
        plotStatevector(statevector);
      }
    }
    


    function mouseUpHandler() {
      const gateRect = gateElement.getBoundingClientRect();
      for (let i=0; i<circuits.length; i++) {
        if (gateRect.left < circuits[i].getBoundingClientRect().right &&
            gateRect.right > circuits[i].getBoundingClientRect().left &&
            gateRect.top < circuits[i].getBoundingClientRect().bottom &&
            gateRect.bottom > circuits[i].getBoundingClientRect().top) {
          circuits[i].style.background = '#333';


          addGate(i, gateElement)
  
          break;
        }


      } 
      
      gateElement.style.left = `${originalX}px`;
      gateElement.style.top = `${originalY}px`;


      document.removeEventListener('mousemove', moveBox);
      document.removeEventListener('mouseup', mouseUpHandler);
    }
 

    
    document.addEventListener('mousemove', moveBox);
    document.addEventListener('mouseup', mouseUpHandler);
  });
});

document.getElementById('clear').addEventListener('click', function() {
  location.reload();
});


const X=[[0,math.complex(1,0)],[math.complex(1,0),0]];
const Y=[[0,math.complex(0,-1)],[math.complex(0,1),0]];
const Z=[[math.complex(1,0),0],[0,math.complex(-1,0)]];
const H=[[math.complex((0.5)**(0.5),0),math.complex((0.5)**(0.5),0)],[math.complex((0.5)**(0.5),0),math.complex(-((0.5)**(0.5)),0)]];

const T=[[math.complex(1,0),0],[0,math.complex((0.5)**(0.5),(0.5)**(0.5))]];

const I=[[math.complex(1,0),0],[0,math.complex(1,0)]];
const II=[[math.complex(1,0)]];
const CNOT=[[math.complex(1,0),0,0,0],[0,math.complex(1,0),0,0],[0,0,0,math.complex(1,0)],[0,0,math.complex(1,0),0]];
const SWAP=[[math.complex(1,0),0,0,0],[0,0,math.complex(1,0),0],[0,math.complex(1,0),0,0],[0,0,0,math.complex(1,0)]];

const gateDic = {'X':X, 'Y':Y, 'Z':Z, 'H':H, 'I':I, 'CNOT':CNOT, 'II':II, 'T':T, 'SWAP':SWAP};

function tensorProduct(A, B) {
  const rowsA = A.length;
  const colsA = A[0].length;
  const rowsB = B.length;
  const colsB = B[0].length;

  const result = Array(rowsA * rowsB).fill(null).map(() => Array(colsA * colsB).fill(null));

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsA; j++) {
      for (let k = 0; k < rowsB; k++) {
        for (let l = 0; l < colsB; l++) {
          const value = math.multiply(A[i][j], B[k][l]);
          result[i * rowsB + k][j * colsB + l] = value;
        }
      }
    }
  }

  return result;
}

function multiplyComplexMatrices(A, B) {
  const rowsA = A.length;
  const colsA = A[0].length;
  const rowsB = B.length;
  const colsB = B[0].length;

  const result = Array(rowsA).fill(null).map(() => Array(colsB).fill(null));

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      result[i][j] = math.complex(0, 0); 
      for (let k = 0; k < colsA; k++) {
        result[i][j] = math.add(result[i][j], math.multiply(A[i][k], B[k][j]));
      }
    }
  }

  return result;
}

function calcFullMatrix() {
  const gateList = deepCopy(inCircuitGates);
  const maxLength = Math.max(gateList[0].length,gateList[1].length,gateList[2].length,gateList[3].length);
  for (let i=0; i<4; i++) {
    while (gateList[i].length<maxLength) {
      gateList[i].push('I');
    }
  }
  let result = tensorProduct(tensorProduct(gateDic[gateList[0][0]], gateDic[gateList[1][0]]), tensorProduct(gateDic[gateList[2][0]], gateDic[gateList[3][0]]));
  for (let i=1; i<maxLength; i++) {
    let mat = tensorProduct(tensorProduct(gateDic[gateList[0][i]], gateDic[gateList[1][i]]), tensorProduct(gateDic[gateList[2][i]], gateDic[gateList[3][i]]));
    result = multiplyComplexMatrices(mat, result);
  }

  return result;
}





function calcStateVector() {
  let result =[];

  for (let i=0; i<16; i++) {
    result.push(calcFullMatrix()[i][0]);
  }

  return result;
}

function plotHistogram(statevector) {
  for (let i=0; i<16; i++) {
    const histogram = document.getElementById(`histogram${i}`);
    histogram.style.height = `${200*(math.abs(statevector[i]))**2}px`;
    if (statevector[i] != 0) {
      histogram.innerHTML = `${(math.abs(statevector[i])**2).toFixed(4)}`;
    } else {
      histogram.innerHTML = '';
    }
  }
}

function plotStatevector(statevector) {
  const statevectormain = document.getElementsByClassName('statevector-main')[0];
  let statevectorStr = '';

  for (let i = 0; i < 16; i++) {
    if (statevector[i] != 0) {
      const realPart = statevector[i].re.toFixed(4);
      const imaginaryPart = statevector[i].im.toFixed(4);
      statevectorStr += `+(${realPart}+${imaginaryPart}i)|` + (i).toString(2).padStart(4, '0') + '> '; 
    }
  }

  statevectormain.innerHTML = statevectorStr;
}





function deepCopy(obj) {
  if (obj === null || typeof obj !== 'object') {
      return obj;
  }
  
  if (Array.isArray(obj)) {
      const copy = [];
      for (let i = 0; i < obj.length; i++) {
          copy[i] = deepCopy(obj[i]);
      }
      return copy;
  }
  
  const copy = {};
  for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
          copy[key] = deepCopy(obj[key]);
      }
  }
  return copy;
}

