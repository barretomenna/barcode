import { ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import Quagga from 'quagga';

@Component({
  selector: 'app-leitor',
  templateUrl: './leitor.component.html',
  styleUrls: ['./leitor.component.css']
})
export class LeitorComponent implements OnInit {

  @ViewChild('teste') teste: ElementRef;
  showScanerArea: boolean;
  barcode = '';
  codigoLido: any;
  configQuagga = {
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: '#inputBarcode',
      constraints: {
        width: { min: 640 },
        height: { min: 480 },
        aspectRatio: { min: 1, max: 200 },
        facingMode: 'environment', // or user
      },
      // area: { // defines rectangle of the detection/localization area
      //   top: '0%',    // top offset
      //   right: '0%',  // right offset
      //   left: '0%',   // left offset
      //   bottom: '0%'  // bottom offset
      // },
      singleChannel: false, // true: only the red color-channel is read
      size: 900
    },
    locator: {
      patchSize: 'medium',
      halfSample: false
    },
    locate: true,
    src: null,
    numOfWorkers: 4,
    // frequency: 10,
    decoder: {
      readers: [
        { 'format': 'i2of5_reader', 'config': {} },
        // 'code_128_reader',
        // 'ean_reader',
        // 'ean_8_reader',
        // 'code_39_reader',
        // 'code_39_vin_reader',
        // 'codabar_reader',
        // 'upc_reader',
        // 'upc_e_reader',
        // 'i2of5_reader',
        // '2of5_reader',
        // 'code_93_reader'
      ]
    }
  };

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() { }

  startScanner() {
    this.showScanerArea = true;
    this.barcode = '';
    this.ref.detectChanges();

    // Quagga.onProcessed((result) => this.onProcessed(result));

    Quagga.onDetected((result) => this.logCode(result));

    Quagga.init(this.configQuagga, (err) => {
      if (err) {
        return console.log(err);
      }
      Quagga.start();
    });
  }

  private onProcessed(result: any) {
    const drawingCtx = Quagga.canvas.ctx.overlay;
    const drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width'), 10), parseInt(drawingCanvas.getAttribute('height'), 10));
        result.boxes.filter(function (box) {
          return box !== result.box;
        }).forEach(function (box) {
          Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'green', lineWidth: 2 });
        });
      }

      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#00f', lineWidth: 2 });
      }

      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
      }
    }
  }

  private logCode(result) {
    const code = result.codeResult.code;
    if (this.barcode !== code) {
      this.barcode = 'Code-barres EAN : ' + code;
      this.ref.detectChanges();
      this.codigoLido = code;
      console.log(this.barcode);
      this.showScanerArea = false;
      Quagga.stop();
    }

  }
}



// 'code_128_reader'
// 'ean_reader'
// 'ean_8_reader'
// 'code_39_reader'
// 'code_39_vin_reader'
// 'codabar_reader'
// 'upc_reader'
// 'upc_e_reader'
// 'i2of5_reader'
// '2of5_reader'
// 'code_93_reader'